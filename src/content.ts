import { canAttach, consumeLease, createLease, selectFile, type FileLease } from "./lease.js";
import { chooseUploadTarget, describeUploadInput, isUploadLabel, type TargetChoice } from "./target.js";

interface AttachUi {
  host: HTMLDivElement;
  render(lease: FileLease, targetCount: number, message?: string): void;
  showAttached(fileName: string): void;
}

const installedFlag = "attachonceInstalled";
if (document.documentElement.dataset[installedFlag] !== "true") {
  document.documentElement.dataset[installedFlag] = "true";
  installAttachOnce();
}

function installAttachOnce(): void {
  let lease = createLease();
  let selectedFile: File | null = null;
  let consumed = false;

  const findUploadInputs = (): HTMLInputElement[] =>
    Array.from(document.querySelectorAll<HTMLInputElement>("input[type='file']"));

  const targetInput = (): { choice: TargetChoice; input: HTMLInputElement | null; count: number } => {
    const all = findUploadInputs();
    const labeled = all.filter((input) => isUploadLabel(describeUploadInput(input)));
    const candidates = labeled.length === 1 ? labeled : all;
    const choice = chooseUploadTarget(candidates.length);
    return { choice, input: choice === "unique" ? candidates[0] : null, count: all.length };
  };

  const ui: AttachUi = createUi({
    onFileSelected(file) {
      if (consumed) {
        return;
      }

      const nextLease = selectFile(createLease(), { name: file.name, size: file.size, type: file.type });
      lease = nextLease;
      selectedFile = nextLease.status === "selected" ? file : null;
      ui.render(lease, targetInput().count);
    },
    onAttach() {
      if (consumed || !selectedFile || !canAttach(lease)) {
        return;
      }

      const target = targetInput();
      if (target.choice !== "unique" || !target.input) {
        ui.render(lease, target.count, target.choice === "none"
          ? "No native file upload control found on this page."
          : "Multiple upload controls found. AttachOnce refuses to guess.");
        return;
      }

      try {
        const transfer = new DataTransfer();
        transfer.items.add(selectedFile);
        target.input.files = transfer.files;
        target.input.dispatchEvent(new Event("input", { bubbles: true }));
        target.input.dispatchEvent(new Event("change", { bubbles: true }));
        const name = selectedFile.name;
        lease = consumeLease(lease);
        selectedFile = null;
        consumed = true;
        ui.showAttached(name);
      } catch {
        ui.render(lease, target.count, "The page rejected this file input. No upload was triggered.");
      }
    },
  });

  ui.render(lease, targetInput().count);
}

function createUi(callbacks: {
  onFileSelected(file: File): void;
  onAttach(): void;
}): AttachUi {
  const host = document.createElement("div");
  host.dataset.attachonceUi = "true";
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .panel { position: fixed; z-index: 2147483647; right: 20px; bottom: 20px; width: min(360px, calc(100vw - 40px)); padding: 18px; border: 1px solid #f2b35e; border-radius: 16px; background: #11100d; color: #fff6e5; box-shadow: 0 18px 50px rgba(0,0,0,.45); font: 14px/1.45 ui-sans-serif, system-ui, sans-serif; }
      .eyebrow { margin: 0 0 6px; color: #ffb45d; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
      h2 { margin: 0 0 8px; font-size: 20px; }
      p { margin: 0 0 10px; color: #d6c8b4; }
      .file { display: block; margin: 12px 0; padding: 12px; border: 1px dashed #9c7442; border-radius: 12px; background: #1d1811; }
      input[type=file] { display: block; width: 100%; color: #ffcf95; font: inherit; }
      .meta { min-height: 22px; color: #fff1d1; overflow-wrap: anywhere; }
      .target { min-height: 20px; color: #a8dcb5; font-size: 12px; }
      button { cursor: pointer; border: 1px solid #9c7442; border-radius: 999px; padding: 10px 13px; background: #2c2114; color: #fff6e5; font: inherit; }
      button.primary { border-color: #ffd59d; background: #ffb45d; color: #211407; font-weight: 800; }
      button:disabled { cursor: not-allowed; opacity: .48; }
      .success { color: #9fe0b2; }
    </style>
    <section class="panel" aria-live="polite" aria-label="AttachOnce">
      <p class="eyebrow">one file · one tab · one time</p>
      <h2>AttachOnce</h2>
      <p>Choose one file. Extension forgets it after one native attachment.</p>
      <label class="file">Choose local file<input id="picker" type="file" /></label>
      <p id="meta" class="meta">No file selected.</p>
      <p id="target" class="target"></p>
      <p id="message"></p>
      <button id="attach" class="primary" type="button" disabled>Attach once</button>
    </section>
  `;
  document.documentElement.append(host);

  const picker = shadow.querySelector<HTMLInputElement>("#picker");
  const attach = shadow.querySelector<HTMLButtonElement>("#attach");
  const meta = shadow.querySelector<HTMLElement>("#meta");
  const target = shadow.querySelector<HTMLElement>("#target");
  const message = shadow.querySelector<HTMLElement>("#message");
  if (!picker || !attach || !meta || !target || !message) {
    throw new Error("AttachOnce UI could not be created");
  }

  picker.addEventListener("change", () => {
    const file = picker.files?.[0];
    if (file) {
      callbacks.onFileSelected(file);
    }
  });
  attach.addEventListener("click", callbacks.onAttach);

  return {
    host,
    render(lease, targetCount, extraMessage) {
      meta.textContent = lease.meta
        ? `${lease.meta.name} · ${formatBytes(lease.meta.size)}${lease.meta.type ? ` · ${lease.meta.type}` : ""}`
        : lease.reason || "No file selected.";
      target.textContent = targetCount === 1
        ? "One page upload control found."
        : targetCount === 0
          ? "No page upload control found yet."
          : `${targetCount} page upload controls found; AttachOnce will refuse to guess.`;
      message.textContent = extraMessage || "The page receives the file only after your click.";
      message.className = "";
      attach.disabled = !canAttach(lease);
    },
    showAttached(fileName) {
      meta.textContent = `${fileName} attached to page input.`;
      target.textContent = "Extension memory cleared. The page controls what happens next.";
      message.textContent = "AttachOnce is spent. Reinvoke the extension for another file.";
      message.className = "success";
      picker.disabled = true;
      attach.disabled = true;
    },
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KiB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

export {};
