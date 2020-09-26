namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * List the external resources
   * @author Jirka Dell'Oro-Friedl, HFU, 2020  
   */
  export class ViewExternal extends View {
    constructor(_container: GoldenLayout.Container, _state: Object) {
      super(_container, _state);

      this.dom.addEventListener(EVENT_EDITOR.SET_PROJECT, this.hndEvent);
    }

    public setProject(): void {
      while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild));
      let path: string = new URL(".", ƒ.Project.baseURL).pathname;
      path = path.substr(1); // strip leading slash
      let root: DirectoryEntry = DirectoryEntry.createRoot(path);
      let tree: ƒui.Tree<DirectoryEntry> = new ƒui.Tree<DirectoryEntry>(new ControllerTreeDirectory(), root);
      this.dom.appendChild(tree);
      tree.getItems()[0].open(true);
    }

    private hndEvent = (_event: CustomEvent): void => {
      this.setProject();
    }
  }
}