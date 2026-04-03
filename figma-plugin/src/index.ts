// Figma plugin entry point
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = (msg: { type: string }) => {
  if (msg.type === 'export-tokens') {
    // Token extraction logic goes here
    figma.closePlugin();
  }
};
