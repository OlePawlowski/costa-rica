/**
 * Vercel Serverless Function – Notizen via GitHub API
 * Schreibt direkt in data.json im Repo.
 *
 * Env-Variablen in Vercel:
 * - GITHUB_TOKEN: Personal Access Token (repo scope)
 * - GITHUB_REPO: z.B. "username/repo"
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    return res.status(503).json({ error: 'API nicht konfiguriert. GITHUB_TOKEN und GITHUB_REPO in Vercel setzen.' });
  }

  const [owner, repoName] = repo.split('/').map(s => s.trim());
  if (!owner || !repoName) {
    return res.status(500).json({ error: 'GITHUB_REPO Format: owner/repo' });
  }

  const path = 'data.json';
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
  const auth = `Bearer ${token}`;

  if (req.method === 'GET') {
    try {
      const r = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.raw',
          Authorization: auth,
        },
      });
      if (r.status === 404) return res.json({ content: {} });
      if (!r.ok) {
        const err = await r.text();
        throw new Error(err || `GitHub ${r.status}`);
      }
      const text = await r.text();
      const data = text ? JSON.parse(text) : { content: {} };
      return res.json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Laden: ' + e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (_) {
          body = { content: {} };
        }
      }
      if (!body || typeof body !== 'object') body = { content: {} };

      const getR = await fetch(url, { headers: { Authorization: auth } });
      let sha = null;
      if (getR.ok) {
        const file = await getR.json();
        sha = file.sha;
      }

      const content = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');

      const putR = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Notizen aktualisiert',
          content,
          sha,
        }),
      });

      if (!putR.ok) {
        let errMsg = putR.statusText;
        try {
          const err = await putR.json();
          errMsg = err.message || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Speichern: ' + e.message });
    }
  }

  return res.status(405).end();
}
