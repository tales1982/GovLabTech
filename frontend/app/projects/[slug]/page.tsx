import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export default async function ProjectPage({ params }: Props) {
  const slug = params.slug;
  const [firstname, ...rest] = slug.split("-");
  const name = rest.join(" ");

  if (!firstname || !name) notFound();

  const res = await fetch(`http://localhost:3001/deputy?name=${firstname} ${name}`, {
    cache: "no-cache",
  });

  if (!res.ok) notFound();

  const data = await res.json();
  const projects = data.laws.details;

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("publie") || lower.includes("publié")) return "#28a745"; // verde
    if (lower.includes("rejete") || lower.includes("rejeté")) return "#dc3545"; // vermelho
    return "#6c757d"; // cinza neutro
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/">
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ← Back to Main Page
          </button>
        </Link>
      </div>

      <h1 style={{ fontSize: "2rem", color: "#003366" }}>
        All Projects of {firstname} {name}
      </h1>

      <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Authors</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project: any, idx: number) => (
              <tr key={idx}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "0.5rem",
                    color: "#fff",
                    backgroundColor: getStatusColor(project.status),
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {project.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{project.authors}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ padding: "1rem", textAlign: "center" }}>
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
