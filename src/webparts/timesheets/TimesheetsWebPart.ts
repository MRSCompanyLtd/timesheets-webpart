import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TimesheetsWebPartStrings';
import Timesheets from './components/Timesheets';
import { ITimesheetsProps } from './components/ITimesheetsProps';

import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph/presets/all";

export interface ITimesheetsWebPartProps {
  description: string;
}

export default class TimesheetsWebPart extends BaseClientSideWebPart<ITimesheetsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITimesheetsProps> = React.createElement(
      Timesheets,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    sp.setup(this.context);
    graph.setup({spfxContext: this.context});
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
