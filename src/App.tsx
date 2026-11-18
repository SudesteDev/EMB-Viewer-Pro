import { useRef, useState } from "react";
import type { DragEvent } from "react";
import {
  AlertCircle,
  Check,
  CircleHelp,
  FileImage,
  FileUp,
  FolderOpen,
  Grid2X2,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Ruler,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Stitch,
  Upload,
} from "lucide-react";
import { formatBytes, inspectEmbFile } from "./lib/emb/inspectEmbFile";
import type { EmbFileSummary } from "./types/emb";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<EmbFileSummary | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState("");

  async function loadFile(selected?: File) {
    if (!selected) return;
    setError("");
    try {
      const summary = await inspectEmbFile(selected);
      setFile(summary);
      setZoom(100);
      setRotation(0);
      if (summary.status === "invalid") setError(summary.message);
    } catch {
      setError("Não foi possível ler este arquivo. Verifique se ele está acessível e tente novamente.");
      setFile(null);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    void loadFile(event.dataTransfer.files[0]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="EMB Viewer Pro início">
          <span className="brand-mark"><Stitch size={22} strokeWidth={1.8} /></span>
          <span className="brand-copy"><strong>EMB Viewer</strong><small>PRO STUDIO</small></span>
        </a>
        <div className="topbar-center"><span className="status-dot" /> AMBIENTE DE VISUALIZAÇÃO</div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" title="Ajuda" aria-label="Ajuda"><CircleHelp size={18} /></button>
          <span className="version-tag">BETA</span>
        </div>
      </header>

      <div className="workspace">
        <section className="workspace-heading">
          <div>
            <div className="eyebrow">FERRAMENTA DE PRODUÇÃO</div>
            <h1>Visualizador de bordados</h1>
            <p>Abra e inspecione seus arquivos Wilcom em um só lugar.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
            <FolderOpen size={17} /> Abrir arquivo
          </button>
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept=".emb"
            onChange={(event) => void loadFile(event.target.files?.[0])}
          />
        </section>

        <section className="viewer-layout">
          <div className="viewer-column">
            <div className="viewer-toolbar">
              <div className="file-identity">
                <span className="file-icon"><FileImage size={17} /></span>
                <div><strong>{file?.name ?? "Nenhum arquivo aberto"}</strong><small>{file ? formatBytes(file.sizeBytes) : "Selecione um arquivo EMB para começar"}</small></div>
              </div>
              <div className="toolbar-controls">
                <button className="tool-button" type="button" title="Diminuir zoom" aria-label="Diminuir zoom" onClick={() => setZoom((value) => Math.max(25, value - 10))}><Minus size={16} /></button>
                <span className="zoom-value">{zoom}%</span>
                <button className="tool-button" type="button" title="Aumentar zoom" aria-label="Aumentar zoom" onClick={() => setZoom((value) => Math.min(300, value + 10))}><Plus size={16} /></button>
                <span className="toolbar-divider" />
                <button className={showGrid ? "tool-button active" : "tool-button"} type="button" title="Alternar grade" aria-label="Alternar grade" aria-pressed={showGrid} onClick={() => setShowGrid((value) => !value)}><Grid2X2 size={16} /></button>
                <button className="tool-button" type="button" title="Girar para a esquerda" aria-label="Girar para a esquerda" onClick={() => setRotation((value) => value - 90)}><RotateCcw size={16} /></button>
                <button className="tool-button" type="button" title="Girar para a direita" aria-label="Girar para a direita" onClick={() => setRotation((value) => value + 90)}><RotateCw size={16} /></button>
                <button className="tool-button" type="button" title="Redefinir visualização" aria-label="Redefinir visualização" onClick={() => { setZoom(100); setRotation(0); }}><Maximize size={16} /></button>
              </div>
            </div>

            <div
              className={`canvas-area ${showGrid ? "with-grid" : ""} ${isDragging ? "dragging" : ""}`}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false); }}
              onDrop={handleDrop}
            >
              <div className="canvas-corner corner-tl" /><div className="canvas-corner corner-tr" />
              <div className="canvas-corner corner-bl" /><div className="canvas-corner corner-br" />
              {file?.status === "unsupported" ? (
                <div className="empty-state file-state">
                  <div className="empty-icon warning-icon"><AlertCircle size={25} /></div>
                  <span className="eyebrow">ARQUIVO RECEBIDO</span>
                  <h2>Leitura EMB ainda não disponível</h2>
                  <p>O arquivo foi selecionado com sucesso. Para exibir o bordado com fidelidade, é necessário integrar um decodificador compatível com o formato nativo Wilcom.</p>
                  <div className="file-received"><Check size={15} /> Arquivo carregado · {formatBytes(file.sizeBytes)}</div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="upload-illustration"><div className="upload-ring"><Upload size={27} /></div><span className="orbit orbit-one" /><span className="orbit orbit-two" /></div>
                  <span className="eyebrow">ÁREA DE VISUALIZAÇÃO</span>
                  <h2>{isDragging ? "Solte o arquivo aqui" : "Seu próximo bordado começa aqui"}</h2>
                  <p>Arraste um arquivo <strong>.EMB</strong> para esta área ou selecione diretamente no computador.</p>
                  <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}><FileUp size={16} /> Selecionar arquivo</button>
                  <span className="format-hint">FORMATO ACEITO · EMB WILCOM</span>
                </div>
              )}
              <div className="canvas-meta"><span><ScanSearch size={13} /> {file ? "INSPEÇÃO DO ARQUIVO" : "AGUARDANDO ARQUIVO"}</span><span>ZOOM {zoom}% · {rotation}°</span></div>
            </div>
            {error && <div className="inline-error" role="alert"><AlertCircle size={16} />{error}</div>}
            <div className="viewer-footer">
              <span><ShieldCheck size={15} /> Processamento local no navegador</span>
              <button type="button" className="text-button" onClick={() => { setFile(null); setError(""); if (inputRef.current) inputRef.current.value = ""; }} disabled={!file}>Fechar arquivo</button>
            </div>
          </div>

          <aside className="inspector">
            <div className="panel-heading"><div><span className="eyebrow">DETALHES</span><h2>Informações do arquivo</h2></div><Settings2 size={18} /></div>
            {file ? (
              <div className="inspector-content">
                <div className="inspection-status"><span className="status-indicator warning" /> <span>Formato aguardando decodificador</span></div>
                <div className="info-block"><label>Nome do arquivo</label><strong className="break-word">{file.name}</strong></div>
                <div className="info-grid">
                  <div className="info-block"><label>Tamanho</label><strong>{formatBytes(file.sizeBytes)}</strong></div>
                  <div className="info-block"><label>Extensão</label><strong>.{file.extension.toUpperCase()}</strong></div>
                </div>
                <div className="info-block"><label>Cabeçalho (16 bytes)</label><code className="hex-value">{file.headerHex || "Indisponível"}</code></div>
                <div className="notice-box"><Info size={17} /><p>{file.message}</p></div>
                <div className="data-placeholder"><Ruler size={17} /><div><strong>Dados do bordado</strong><span>Dimensões, pontos e cores serão exibidos após a integração do parser.</span></div></div>
              </div>
            ) : (
              <div className="inspector-empty"><div className="inspector-empty-icon"><ScanSearch size={22} /></div><strong>Nenhum arquivo selecionado</strong><p>As propriedades técnicas do bordado aparecerão aqui após a abertura de um arquivo compatível.</p></div>
            )}
            <div className="panel-bottom"><span>COMPATIBILIDADE</span><strong><span className="compat-dot" /> Parser EMB pendente</strong></div>
          </aside>
        </section>

        <footer className="app-footer"><span>EMB VIEWER PRO <span className="footer-separator">/</span> WORKSPACE</span><span>Visualização técnica de arquivos de bordado</span></footer>
      </div>
    </main>
  );
}

export default App;
