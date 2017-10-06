import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { JsonSchemaFormService } from 'angular2-json-schema-form';

@Component({
	selector: 'bb-form-framework',
	template: `
		<div class="error"></div>
		<select-widget-widget [formID]="formID" [layoutNode]="layoutNode" [dataIndex]="dataIndex"
							  [layoutIndex]="layoutIndex" data-css="c-form"></select-widget-widget>
	`
})
export class BBFormFrameworkComponent implements OnInit, OnChanges {
	private controlInitialized = false;
	private controlType: string;
	private inputType: string;
	private options: any; // Options used in this framework
	private widgetLayoutNode: any; // layoutNode passed to child widget
	private widgetOptions: any; // Options passed to child widget
	private layoutPointer: string;
	private formControl: any = null;
	@Input() formID: number;
	@Input() layoutNode: any;
	@Input() layoutIndex: number[];
	@Input() dataIndex: number[];
	@Input() i18n: any;

	constructor(private changeDetector: ChangeDetectorRef,
				private jsf: JsonSchemaFormService) {
	}

	ngOnInit() {
		this.i18n = this.jsf.globalOptions.i18n;

		this.initializeControl();
	}

	ngOnChanges() {
		if (!this.controlInitialized) {
			this.initializeControl();
		}
	}

	private initializeControl() {
		if (this.layoutNode) {
			this.options = _.cloneDeep(this.layoutNode.options);

			this.widgetLayoutNode = Object.assign(
				{}, this.layoutNode, {options: _.cloneDeep(this.layoutNode.options)}
			);
			this.widgetOptions = this.widgetLayoutNode.options;
			this.layoutPointer = this.jsf.getLayoutPointer(this);
			this.formControl = this.jsf.getControl(this);

			this.options.title = this.setTitle();

			if (this.options.minimum && this.options.maximum) {
				this.layoutNode.type = 'range';
			}


			// Set control type and associated settings
			switch (this.layoutNode.type) {

				case 'text':
				case 'email':
				case 'integer':
				case 'url':
				case 'number':
				case 'search':
				case 'tel':
				case 'password':
				case 'datetime-local':
					this.controlType = 'input';
					if (this.layoutNode.type === 'integer') {
						this.inputType = 'number';
					} else {
						this.layoutNode.type = this.layoutNode.type;
						this.inputType = this.layoutNode.type;
					}
					break;


				case 'hidden':
					this.controlType = 'none'; // TODO: add apropriate widgets for hidden, color, and image
					break;

				case 'textarea':
					this.controlType = 'textarea';
					break;

				case 'select':
					this.controlType = 'select';
					break;

				case 'checkbox':
					this.controlType = 'checkbox';
					break;

				case 'checkboxes':
				case 'checkboxes-inline':
				case 'checkboxbuttons':
					this.controlType = 'checkboxes';
					break;

				case 'radio':
				case 'radios':
				case 'radios-inline':
					this.controlType = 'radios';
					break;

				case 'radiobuttons':
					this.controlType = 'buttonGroup';
					// TODO: update buttonGroup to also handle checkboxbuttons
					break;

				case 'reset':
				case 'submit':
				case 'button':
					this.controlType = 'button';
					break;

				case 'fieldset':
				case 'tab':
				case 'wizard-step':
					this.controlType = 'fieldset';
					break;

				case 'help':
				case 'message':
				case 'msg':
				case 'html':
					this.controlType = 'message';
					break;

				case 'template':
					this.controlType = 'template';
					break;
				case 'wizard':
					this.controlType = 'wizard';
					break;
				default:
					this.controlType = this.layoutNode.type;
			}
			this.controlInitialized = true;
		}
	}

	private setTitle(): string {
		switch (this.layoutNode.type) {
			case 'array':
			case 'button':
			case 'checkbox':
			case 'conditional':
			case 'fieldset':
			case 'help':
			case 'msg':
			case 'message':
			case 'section':
			case 'submit':
			case 'tabarray':
			case 'wizard':
			case '$ref':
				return null;
			case 'advancedfieldset':
				this.widgetOptions.expandable = true;
				this.widgetOptions.title = 'Advanced options';
				return null;
			case 'authfieldset':
				this.widgetOptions.expandable = true;
				this.widgetOptions.title = 'Authentication settings';
				return null;
			default:
				const thisTitle = this.options.title || (
						isNaN(this.layoutNode.name) && this.layoutNode.name !== '-' ?
							this.layoutNode.name : null
					);
				this.widgetOptions.title = null;
				if (!thisTitle) {
					return null;
				}
				if (thisTitle.indexOf('{') === -1 || !this.formControl || !this.dataIndex) {
					return thisTitle;
				}
				return this.jsf.parseText(
					thisTitle,
					this.jsf.getControlValue(this),
					this.jsf.getControlGroup(this).value,
					this.dataIndex[this.dataIndex.length - 1]
				);
		}
	}
}
