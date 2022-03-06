import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HostComponent } from './_components/host/host.component';
import { GoldenLayoutComponentService } from './_services/golden-layout-component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  title = 'golden-layout-1';
  private _windowResizeListener = () => this.handleWindowResizeEvent();
constructor( private goldenLayoutComponentService: GoldenLayoutComponentService){

}
  @ViewChild('goldenLayoutHost') private _goldenLayoutHostComponent!: HostComponent;

  ngAfterViewInit(): void {

    setTimeout(() => {
      this._goldenLayoutHostComponent.initialise();

      this._goldenLayoutHostComponent.goldenLayout.addComponent('ChildOne',undefined,'کامپوننت اول');
      this._goldenLayoutHostComponent.goldenLayout.addComponent('ChildTwo');
      globalThis.addEventListener('resize', this._windowResizeListener);

    }, 0);
  }
  private handleWindowResizeEvent() {
    // handling of resize event is required if GoldenLayout does not use body element
    this.resizeGoldenLayout();
  }

  private resizeGoldenLayout() {
    const bodyWidth = document.body.offsetWidth;

    const height = document.body.offsetHeight;
    this._goldenLayoutHostComponent.setSize(bodyWidth , height)
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
