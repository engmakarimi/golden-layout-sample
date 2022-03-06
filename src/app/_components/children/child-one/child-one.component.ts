import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseContainerComponent } from 'src/app/_base-components/base-container/base-container.component';

@Component({
  selector: 'child-one',
  templateUrl: './child-one.component.html',
  styleUrls: ['./child-one.component.scss']
})
export class ChildOneComponent extends BaseContainerComponent {

  constructor(@Inject(BaseContainerComponent.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef) {
    super(elRef.nativeElement);
  }

  ngOnInit() {
  }

}
