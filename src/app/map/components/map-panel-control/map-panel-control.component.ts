import { Component, Output, signal, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'map-panel-control',
  standalone: true,
  imports: [],
  templateUrl: './map-panel-control.component.html',
  styleUrl: './map-panel-control.component.css'
})
export class MapPanelControlComponent {

  @Input() sliderValue = signal(0);
  @Output() changeCheckBoxPanel: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() changeRangeSliderPanel: EventEmitter<Number> = new EventEmitter<Number>();

  onChangeRangeSliderPanel(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.sliderValue.set(parseInt(value));
    this.changeRangeSliderPanel.emit(parseInt(value));
  }

  onChangeCheckBoxPanel(event: Event) {
    const value = (event.target as HTMLInputElement);
    this.changeCheckBoxPanel.emit(value.checked);
  }
}
