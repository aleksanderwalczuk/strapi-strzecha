import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderProvidersOrderProvider extends Schema.Component {
  collectionName: 'components_order_providers_order_providers';
  info: {
    displayName: 'OrderProvider';
    icon: 'allergies';
  };
  attributes: {
    name: Attribute.String;
    url: Attribute.String;
    label: Attribute.String;
  };
}

export interface SettingsContact extends Schema.Component {
  collectionName: 'components_settings_contacts';
  info: {
    displayName: 'Contact';
  };
  attributes: {
    phone: Attribute.String;
    address_1: Attribute.String;
    address_2: Attribute.String;
    email: Attribute.Email;
  };
}

export interface SettingsHomePage extends Schema.Component {
  collectionName: 'components_settings_home_pages';
  info: {
    displayName: 'Home Page';
  };
  attributes: {
    description: Attribute.Text;
    coverImage: Attribute.Media;
  };
}

export interface SettingsNavigation extends Schema.Component {
  collectionName: 'components_settings_navigations';
  info: {
    displayName: 'Navigation';
  };
  attributes: {
    show_empty_categories: Attribute.Boolean;
    menu_image: Attribute.Media;
  };
}

export interface SettingsSocial extends Schema.Component {
  collectionName: 'components_socials_socials';
  info: {
    displayName: 'Socials';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    label: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 2;
      }>;
    url: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'order-providers.order-provider': OrderProvidersOrderProvider;
      'settings.contact': SettingsContact;
      'settings.home-page': SettingsHomePage;
      'settings.navigation': SettingsNavigation;
      'settings.social': SettingsSocial;
    }
  }
}
