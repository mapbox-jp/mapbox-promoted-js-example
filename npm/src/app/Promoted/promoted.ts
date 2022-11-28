/// <reference types="mapbox-gl" />
declare module 'mapbox-promoted-js' {
  namespace Promoted {
    namespace Core {
      type Options = {
        map: PromotedPlugin.Plugin | mapboxgl.Map;
        accessToken: string;
        container: HTMLElement;
        baseUrl?: string;
        logUrl?: string;
        baseColor?: string;
        scaleIcon?: number;
        popup?: boolean;
        sideCard?: boolean;
        mediaModal?: boolean;
      };
    }

    type Tile = {
      x: number;
      y: number;
      z: number;
      quadkey: string;
    };

    class Event {
      type: EventTypes;
      data: Object;
      constructor(type: EventTypes, data?: Object);
    }

    const EVENT_TYPES: {
      readonly LOAD: 'load';
      readonly MOVEEND: 'moveend';
      readonly ZOOMEND: 'zoomend';
      readonly SOURCEDATA: 'sourcedata';
      readonly SOURCEDATAEND: 'sourcedataend';
      readonly CLICK_PIN: 'click_pin';

      readonly START_SESSION: 'start_session';
      readonly UPDATE_SESSION: 'update_session';
      readonly END_SESSION: 'end_session';

      readonly CLICK_POPUP: 'click_popup';
      readonly SHOW_POPUP: 'show_popup';
      readonly CLOSE_POPUP: 'close_popup';

      readonly CLICK_CARD: 'click_card';
      readonly SHOW_CARD: 'show_card';
      readonly UPDATE_CARD: 'update_card';
      readonly CLOSE_CARD: 'close_card';
    
      readonly CLICK_SIDE_CARD: 'click_side_card';
      readonly SHOW_SIDE_CARD: 'show_side_card';
      readonly UPDATE_SIDE_CARD: 'update_side_card';
      readonly OPEN_SIDE_CARD: 'open_side_card';
      readonly HIDE_SIDE_CARD: 'hide_side_card';
      readonly CLOSE_SIDE_CARD: 'close_side_card';
    }
    type EventTypes = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
    type Listener = (type: EventTypes, event: Promoted.EventData) => any;

    namespace Session {
      namespace Event {
        type Listener = (type: EventTypes, event: Promoted.EventData) => any;
        type Listeners = { [key: string]: Array<Listener> };
      }
  
      const EVENT_TYPES: {
        readonly START_SESSION: 'start_session';
        readonly UPDATE_SESSION: 'update_session';
        readonly END_SESSION: 'end_session';
      };
      type EventTypes = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

      class Event {
        type: EventTypes;
        data: Object;
        constructor(type: EventTypes, data?: Object);
      }
    }

    namespace EventData {
      type EventTypes = Promoted.EventTypes | Promoted.Session.EventTypes;
    }
  
    class EventData {
      type: EventData.EventTypes;
      data: Object;
      constructor(type: EventData.EventTypes, data?: Object);
    } 
  }

  export class Promoted {
    constructor(options?: Promoted.Core.Options);
    get map(): any;
    get plugin(): PromotedPlugin.Plugin;
    get tilesets(): { [quadkey: string]: Feature[] };
    get features(): Feature[];

    public show(feature: Feature): void;
    public visibleLayer(): void;
    public hideLayer(): void;
    public selectFeature(feature: Feature): void;
    public deselectLayer(): void;
    public reload(): void;
    public sendAction(feature: Feature, clickType: Promotion.ClickTypes): void;
    public renderPromotionSideCardInnerElement(container: string | HTMLElement, feature: Feature): HTMLElement | undefined;

    public on(type: Promoted.EventTypes, listener: Promoted.Listener): void;
    public off(type: Promoted.EventTypes, listener: Promoted.Listener): void;
    public fire(event: Promoted.EventData): void;
  }

  namespace Feature {
    interface Properties {
      auction_id: string;
      feature_id: string;
      cps: string;
      promotion_type?: PromotionTypes;
      icon?: string;
      advertizer?: string;
      category?: string;
      address_ja?: string;
      address_en?: string;
      address_remarks?: string;
      name_ja?: string;
      name_en?: string;
      subtitle?: string;
      summary?: string;
      phone_number?: string;
      promotion_banner?: string;
      promotion_banner_width?: number;
      promotion_banner_height?: number;
      promotion_card?: string;
      promotion_url?: string;
      directions?: string;
      lat?: string;
      lng?: string;
      min_zoom?: string;
      business_hours?: string;
      business_hours_remarks?: string;
      external_links?: string;
      profile?: string;
    }
    const PROMOTION_TYPES: {
      readonly CARD: 'card';
    }
    type PromotionTypes = typeof PROMOTION_TYPES[keyof typeof PROMOTION_TYPES];
    const EXTERNAL_LINK_TYPES: {
      readonly LINE: 'line';
      readonly INSTAGRAM: 'instagram';
      readonly FACEBOOK: 'facebook';
      readonly TWITTER: 'twitter';
      readonly APP_STORE: 'app_store';
      readonly PLAY_STORE: 'play_store';
    }
    type ExternalLinkTypes = typeof EXTERNAL_LINK_TYPES[keyof typeof EXTERNAL_LINK_TYPES];
    type ExternalLink = {
      type: ExternalLinkTypes;
      url: string;
    };
    namespace Properties {
      type BusinessHours = {
        monday?: string;
        tuesday?: string;
        wednesday?: string;
        thursday?: string;
        friday?: string;
        saturday?: string;
        sunday?: string;
      };
    }
    namespace Profile {
      type Category = {
        id: string;
        name: string;
      };
      type MediaItem = {
        id: string;
        mime_type: string;
        url: string;
        width: number;
        height: number;
      };
      type MediaItems = {
        small: MediaItem;
        medium: MediaItem;
        large: MediaItem;
      };
      type News = {
        id: string;
        title: string;
        text: string;
        media_items: MediaItems;
      };
      type Product = {
        id: string;
        category_ids: string[];
        title: string;
        price: string;
        image_url: string;
      };
      type Media = {
        id: string;
        category_ids: string[];
        type: string;
        title?: string;
        media_items: MediaItems;
      };
    }
    type Profile = {
      news?: boolean;
      products?: boolean;
      media?: boolean;
    };
    type ProfileItems = {
      news?: Profile.News;
      product?: Profile.Product;
      media?: Profile.Media;
    };
    type ProfileItem = Profile.News | Profile.Product | Profile.Media;
    const PROFILE_ITEM_TYPES: {
      readonly NEWS_ITEM: 'NewsItem';
      readonly PRODUCT_ITEM: 'ProductItem';
      readonly MEDIA_ITEM: 'MediaItem';
    }
    type ProfileItemTypes = typeof PROFILE_ITEM_TYPES[keyof typeof PROFILE_ITEM_TYPES];
  }
  interface Feature extends mapboxgl.MapboxGeoJSONFeature {
    properties: Feature.Properties;
    geometry: GeoJSON.Geometry;
  }
}