import * as quasar from 'quasar';
import * as cordovaApplovin from '@awesome-cordova-plugins/applovin';
import type { ApplovinOriginal as IApplovin } from '@awesome-cordova-plugins/applovin';

export let adManager = {
  _applovin: null as any,
  _applovinWrapper: null as unknown as IApplovin,
  initialized: false,
  visible: false,
  size: { x: 0, y: 0 },
  async init() {/**/},
  showPopup() {/**/},
  async refreshBanner({ force = false }: { force?: boolean } = {}) {/**/},
  async destroyBanner() {/**/},
};

const applovinSdkKey = process.env.VITE_APPLOVIN_SDK_KEY;
let applovinBannerId: string | undefined;
let applovinPopupId: string | undefined;

if (quasar.Platform.is.nativeMobile) {
  const isApplovinTest = Boolean(+(process.env.VITE_APPLOVIN_TEST!));
  if (quasar.Platform.is.ios) {
    applovinBannerId = process.env.VITE_APPLOVIN_BANNER_IOS_ID || undefined;
    applovinPopupId = process.env.VITE_APPLOVIN_POPUP_IOS_ID || undefined;
  } else if (quasar.Platform.is.android) {
    applovinBannerId = process.env.VITE_APPLOVIN_BANNER_ANDROID_ID || undefined;
    applovinPopupId = process.env.VITE_APPLOVIN_POPUP_ANDROID_ID || undefined;
  }

  const { Applovin, AdViewPosition } = cordovaApplovin;

  adManager = {
    // cordova-plugin-applovin-max
    _applovin: (window as any)?.applovin,
    // promise-aware plugin wrappers, most methods are buggy
    // https://github.com/danielsogl/awesome-cordova-plugins/issues/4637
    _applovinWrapper: Applovin,
    initialized: false,
    visible: false,
    size: { x: 0, y: 0 },
    async init() {
      try {
        if (this._applovin && applovinSdkKey) {
          this._applovin.setVerboseLogging(true);
          // properly promisified method
          await this._applovinWrapper.initialize(applovinSdkKey!);
          this._applovin.setBannerBackgroundColor(applovinBannerId!, '#ffffff');

          if (applovinBannerId || isApplovinTest) {
            this._applovin.createBanner(
              applovinBannerId!,
              AdViewPosition.TOP_CENTER
            );
          }

          if (applovinPopupId || isApplovinTest) {
            this._applovin.loadInterstitial(applovinPopupId!);
          }
        }

        this.initialized = true;
        const isTablet = this._applovin.isTablet();
        this.size = isTablet ? { x: 728, y: 90 } : { x: 320, y: 50 };
      } catch (err) {
        console.error(err);
      }
    },
    showPopup() {
      if (!this.initialized) {
        return;
      }

      setTimeout(() => this._applovin.showInterstitial(applovinPopupId), 30000);
    },
    async refreshBanner({ force = false }: { force?: boolean } = {}) {
      if (!this.initialized) {
        return;
      }

      if (this.visible && force) {
        await this._applovin.destroyBanner(applovinBannerId!);
        this.visible = false;
      }

      if (!this.visible) {
        await this._applovin.showBanner(applovinBannerId!);
      }
    },
    async destroyBanner() {
      if (!this.initialized) {
        return;
      }

      this._applovin.destroyBanner(applovinBannerId!);
    }
  }
}
