figma.showUI(__html__, { width: 380, height: 420 });

// Load saved settings and send to UI on open
(async () => {
  const apiKey = await figma.clientStorage.getAsync('apiKey') ?? '';
  const backendUrl = await figma.clientStorage.getAsync('backendUrl') ?? '';
  figma.ui.postMessage({ type: 'load-settings', apiKey, backendUrl });
})();

figma.ui.onmessage = async (msg: { type: string; apiKey?: string; backendUrl?: string }) => {
  if (msg.type === 'export-tokens') {
    const tokens = extractTokens();
    figma.ui.postMessage({ type: 'tokens-ready', tokens });
  }

  if (msg.type === 'save-settings') {
    await figma.clientStorage.setAsync('apiKey', msg.apiKey ?? '');
    await figma.clientStorage.setAsync('backendUrl', msg.backendUrl ?? '');
  }
};

function extractTokens() {
  const tokens: Array<{
    name: string;
    type: 'color' | 'spacing' | 'typography' | 'border-radius';
    value: string;
    source: 'figma';
  }> = [];

  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify('Select at least one element first');
    return tokens;
  }

  for (const node of nodes) {
    if ('fills' in node) {
      const fills = node.fills as Paint[];
      for (const fill of fills) {
        if (fill.type === 'SOLID') {
          const { r, g, b } = fill.color;
          tokens.push({
            name: `${node.name}/color`,
            type: 'color',
            value: rgbToHex(r, g, b),
            source: 'figma',
          });
        }
      }
    }

    if ('width' in node) {
      tokens.push({
        name: `${node.name}/width`,
        type: 'spacing',
        value: `${node.width}px`,
        source: 'figma',
      });
    }
  }

  return tokens;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
