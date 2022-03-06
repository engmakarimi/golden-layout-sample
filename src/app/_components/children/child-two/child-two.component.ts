import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseContainerComponent } from 'src/app/_base-components/base-container/base-container.component';

@Component({
  selector: 'child-two',
  templateUrl: './child-two.component.html',
  styleUrls: ['./child-two.component.scss']
})
export class ChildTwoComponent extends BaseContainerComponent {

  constructor(@Inject(BaseContainerComponent.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef) {
    super(elRef.nativeElement);
  }


  ngOnInit() {
  }

}
