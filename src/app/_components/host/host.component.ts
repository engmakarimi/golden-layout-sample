import { ApplicationRef, Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentContainer, GoldenLayout, LogicalZIndex, ResolvedComponentItemConfig } from 'golden-layout';
import { BaseContainerComponent } from 'src/app/_base-components/base-container/base-container.component';
import { GoldenLayoutComponentService } from 'src/app/_services/golden-layout-component.service';
import { ChildOneComponent } from '../children/child-one/child-one.component';
import { ChildTwoComponent } from '../children/child-two/child-two.component';

@Component({
  selector: 'host',
  template: '<ng-template #componentViewContainer></ng-template>',
  styles: [`
    :host {
      height: 100%;
      width: 100%;
      padding: 0;
      position: relative;
    }
    `,
  ],
})
export class HostComponent implements OnInit {

  private _componentRefMap = new Map<ComponentContainer, ComponentRef<BaseContainerComponent>>();
  private _goldenLayout!: GoldenLayout;
  private _goldenLayoutElement: HTMLElement;
  private _viewContainerRefActive = true;

  //we can get height and width and position of this component
  private _goldenLayoutBoundingClientRect: DOMRect = new DOMRect();



  private _goldenLayoutBindComponentEventListener =
    (container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => this.handleBindComponentEvent(container, itemConfig);
  private _goldenLayoutUnbindComponentEventListener =
    (container: ComponentContainer) => this.handleUnbindComponentEvent(container);

  @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true }) private _componentViewContainerRef!: ViewContainerRef;

   get isGoldenLayoutSubWindow() { return this._goldenLayout.isSubWindow; }

   get goldenLayout() { return this._goldenLayout; }


  constructor(private _appRef: ApplicationRef,
    private _elRef: ElementRef<HTMLElement>,
    private goldenLayoutComponentService: GoldenLayoutComponentService,
  ) {
    this._goldenLayoutElement = this._elRef.nativeElement;
    // this._goldenLayout = new GoldenLayout()

    this.goldenLayoutComponentService.registerComponentType('ChildOne', ChildOneComponent);
      this.goldenLayoutComponentService.registerComponentType('ChildTwo', ChildTwoComponent);
  }

  ngOnInit() {
  }

  initialise() {
    this._goldenLayout = new GoldenLayout(
      this._goldenLayoutElement,
      this._goldenLayoutBindComponentEventListener,
      this._goldenLayoutUnbindComponentEventListener,
    );
    this._goldenLayout.beforeVirtualRectingEvent = (count:number) => this.handleBeforeVirtualRectingEvent(count);

    //isSubWindow ==> True if the layout has been opened as a popout by another layout
    if (this._goldenLayout.isSubWindow) {

      /**
     * Will add button if not popinOnClose specified in settings
     * @returns true if added otherwise false
     */
      this._goldenLayout.checkAddDefaultPopinButton();
    }
  }

  private handleBeforeVirtualRectingEvent(count: number) {
    this._goldenLayoutBoundingClientRect = this._goldenLayoutElement.getBoundingClientRect();
  }


  setSize(width: number, height: number) {
    this._goldenLayout.setSize(width, height)
  }


  //#region call it when want to add cmp to host
  private handleBindComponentEvent(container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent {

    console.log('in handle bind component event');
    console.log(container);

    const componentType = itemConfig.componentType;
    const componentRef = this.goldenLayoutComponentService.createComponent(componentType, container);
    const component = componentRef.instance;

    this._componentRefMap.set(container, componentRef);
    //Layout calculates the position
      container.virtualRectingRequiredEvent = (container, width, height) => this.handleContainerVirtualRectingRequiredEvent(container, width, height);
     //Layout calculates the Visibility
      container.virtualVisibilityChangeRequiredEvent = (container, visible) => this.handleContainerVisibilityChangeRequiredEvent(container, visible);
    //Layout calculates the Z-Index
      container.virtualZIndexChangeRequiredEvent = (container, logicalZIndex, defaultZIndex) => this.handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex);

      this._componentViewContainerRef.insert(componentRef.hostView);
      console.log(componentRef)
      console.log('componentRef.hostView');
      console.log(componentRef.hostView)
      console.log('this._componentViewContainerRef')
      console.log(component)
      return {
      component,
      virtual: true,
    }
  }
  //#endregion


//#region call it when detach cmp from host
private handleUnbindComponentEvent(container: ComponentContainer) {


  const componentRef = this._componentRefMap.get(container);
  if (componentRef === undefined) {
    throw new Error('Could not unbind component. Container not found');
  }
  this._componentRefMap.delete(container);

  const hostView = componentRef.hostView;

  if (container.virtual) {
    if (this._viewContainerRefActive) {
      const viewRefIndex = this._componentViewContainerRef.indexOf(hostView);
      if (viewRefIndex < 0) {
        throw new Error('Could not unbind component. ViewRef not found');
      }
      this._componentViewContainerRef.remove(viewRefIndex);
    } else {
      const component = componentRef.instance;
      const componentRootElement = component.rootHtmlElement;
      this._goldenLayoutElement.removeChild(componentRootElement);
      this._appRef.detachView(hostView);
    }
  } else {
    const component = componentRef.instance;
    const componentRootElement = component.rootHtmlElement;
    container.element.removeChild(componentRootElement);
    this._appRef.detachView(hostView);
  }

  componentRef.destroy();
  }
//#endregion



//#region handle position and z-index
// calculate width and hight and visibility and z-index

private handleContainerVirtualRectingRequiredEvent(container: ComponentContainer, width: number, height: number) {
  const containerBoundingClientRect = container.element.getBoundingClientRect();
  const left = containerBoundingClientRect.left - this._goldenLayoutBoundingClientRect.left;
  const top = containerBoundingClientRect.top - this._goldenLayoutBoundingClientRect.top;

  const componentRef = this._componentRefMap.get(container);
  if (componentRef === undefined) {
      throw new Error('handleContainerVirtualRectingRequiredEvent: ComponentRef not found');
  }
  const component = componentRef.instance;
  component.setPositionAndSize(left, top, width, height);
}

private handleContainerVisibilityChangeRequiredEvent(container: ComponentContainer, visible: boolean) {
  const componentRef = this._componentRefMap.get(container);
  if (componentRef === undefined) {
      throw new Error('handleContainerVisibilityChangeRequiredEvent: ComponentRef not found');
  }
  const component = componentRef.instance;
  component.setVisibility(visible);
}

private handleContainerVirtualZIndexChangeRequiredEvent(container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) {
  const componentRef = this._componentRefMap.get(container);
  if (componentRef === undefined) {
      throw new Error('handleContainerVirtualZIndexChangeRequiredEvent: ComponentRef not found');
  }
  const component = componentRef.instance;
  component.setZIndex(defaultZIndex);
}

//#endregion





ngOnDestroy() {
  this._goldenLayout.destroy();
}
}



