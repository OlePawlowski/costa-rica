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
    return res.status(503).json({ error: 'API nicht konfiguriert' });
  }

  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    return res.status(500).json({ error: 'GITHUB_REPO Format: owner/repo' });
  }

  const path = 'data.json';
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;

  if (req.method === 'GET') {
    try {
      const r = await fetch(url, {
        headers: { Accept: 'application/vnd.github.raw' },
      });
      if (r.status === 404) return res.json({ content: {} });
      if (!r.ok) throw new Error(r.statusText);
      const text = await r.text();
      const data = text ? JSON.parse(text) : { content: {} };
      return res.json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const getR = await fetch(url, { headers: { Authorization: `token ${token}` } });
      let sha = null;
      if (getR.ok) {
        const file = await getR.json();
        sha = file.sha;
      }

      const body = typeof req.body === 'object' ? req.body : { content: {} };
      const content = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');

      const putR = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Notizen aktualisiert',
          content,
          sha,
        }),
      });

      if (!putR.ok) {
        const err = await putR.json();
        throw new Error(err.message || putR.statusText);
      }
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
