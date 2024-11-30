import { defineStore } from "pinia";
import { VendorService } from "~/services/vendor.service";
import type { ProductEntity } from "~/types/product";
import type { UserEntity, Vendor } from "~/types/user";

interface VendorStore {
  Vendors: UserEntity[] | [];
  VendorProducts: ProductEntity[] | [];
  SelectedVendor: UserEntity | null;
  SelectedProduct: { product: ProductEntity | null; quantity: number };
  vendorLoadingStates: {
    loadingVendors: boolean;
    loadingProducts: boolean;
  };
}

export const useVendorStore = defineStore("VendorStore", {
  state: (): VendorStore => {
    return {
      Vendors: [],
      VendorProducts: [],
      SelectedProduct: { product: null, quantity: 1 },
      SelectedVendor: null,
      vendorLoadingStates: {
        loadingVendors: false,
        loadingProducts: false,
      },
    };
  },

  getters: {
    vendors(state: VendorStore): VendorStore["Vendors"] {
      return state.Vendors;
    },
    vendorProducts(state: VendorStore): VendorStore["VendorProducts"] {
      return state.VendorProducts;
    },
    selectedVendor(state: VendorStore): VendorStore["SelectedVendor"] {
      return state.SelectedVendor;
    },
    selectedProduct(state: VendorStore): VendorStore["SelectedProduct"] {
      return state.SelectedProduct;
    },
  },

  actions: {
    async getVendors() {
      this.vendorLoadingStates.loadingVendors = true;
      const res = await VendorService.getVendors();
      this.Vendors = res.data.results;
      this.vendorLoadingStates.loadingVendors = false;
    },

    async getSelectedVendor(vendorId: string) {
      this.vendorLoadingStates.loadingVendors = true;
      const res = await VendorService.getSelectedVendor(vendorId);
      this.SelectedVendor = res.data;
      this.vendorLoadingStates.loadingVendors = false;
    },

    async getVendorProducts(id: string) {
      this.vendorLoadingStates.loadingProducts = true;
      const res = await VendorService.getVendorProducts(id);
      this.VendorProducts = res.data.results;
      this.vendorLoadingStates.loadingProducts = false;
    },

    async selectProduct(product: ProductEntity, quantity: number) {
      this.SelectedProduct = { product, quantity };
    },

    isStoreOpen(schedule: Vendor["schedule"]) {
      if (schedule === null) return false;
      // Get the current date and time in the specified timezone

      const currentDate = new Date();
      const timeZone = schedule.timezone;

      // Set the current day of the week (0: Sunday, 1: Monday, ..., 6: Saturday)
      const currentDay = currentDate.getDay();
      const dayName = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
        currentDay
      ];

      // Get the store's schedule for the current day
      const daySchedule = schedule.schedule[dayName];

      // If there's no opening hours for today, the store is closed
      if (!daySchedule || !daySchedule.from || !daySchedule.to) {
        return false;
      }

      // Get the store's opening and closing times for today
      const openingTime = daySchedule.from;
      const closingTime = daySchedule.to;

      // Convert the opening and closing times to Date objects on the current date
      const openingDate = new Date(
        currentDate.setHours(openingTime.hr, openingTime.min, 0, 0),
      );
      const closingDate = new Date(
        currentDate.setHours(closingTime.hr, closingTime.min, 0, 0),
      );

      // Check if the current time is within the store's opening hours
      const currentTime = new Date();

      // Return true if the store is open, false otherwise
      return currentTime >= openingDate && currentTime <= closingDate;
    },
  },
  persist: true,
});