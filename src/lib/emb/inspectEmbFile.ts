import type { EmbFileSummary } from "../../types/emb";

const HEADER_LENGTH = 16;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export { formatBytes };

export async function inspectEmbFile(file: File): Promise<EmbFileSummary> {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";

  if (extension !== "emb") {
    return {
      name: file.name,
      sizeBytes: file.size,
      extension,
      headerHex: "",
      status: "invalid",
      message: "Formato não reconhecido. Selecione um arquivo com extensão .EMB.",
    };
  }

  if (file.size === 0) {
    return {
      name: file.name,
      sizeBytes: 0,
      extension,
      headerHex: "",
      status: "invalid",
      message: "O arquivo está vazio e não contém dados para inspeção.",
    };
  }

  const header = new Uint8Array(await file.slice(0, HEADER_LENGTH).arrayBuffer());
  const headerHex = Array.from(header, (byte) => byte.toString(16).padStart(2, "0"))
    .join(" ")
    .toUpperCase();

  return {
    name: file.name,
    sizeBytes: file.size,
    extension,
    headerHex,
    status: "unsupported",
    message:
      "O arquivo foi recebido e inspecionado, mas a decodificação do formato nativo Wilcom EMB ainda não está implementada. Nenhuma prévia ou dado de bordado será inventado.",
  };
}
