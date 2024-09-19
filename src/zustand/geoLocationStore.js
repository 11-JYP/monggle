import { create } from "zustand";

const defaultLocation = {
  lat: 33.450701,
  lng: 126.570667
};

const useGeoLocationStore = create((set) => ({
  geoLocationDataStore: {
    center: defaultLocation,
    errMsg: null,
    isLoading: true
  },
  setGeoLocation: (location) =>
    set((state) => ({
      geoLocationDataStore: {
        ...state.geoLocationDataStore,
        center: location,
        isLoading: false
      }
    })),
  setGeoLocationError: (message) =>
    set((state) => ({
      geoLocationDataStore: {
        ...state.geoLocationDataStore,
        errMsg: message,
        center: defaultLocation,
        isLoading: false
      }
    })),
  getGeoLocation: () => {
    set((state) => ({
      geoLocationDataStore: {
        ...state.geoLocationDataStore,
        isLoading: true
      }
    }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          set((state) => ({
            geoLocationDataStore: {
              ...state.geoLocationDataStore,
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              isLoading: false
            }
          }));
          console.log(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          set((state) => ({
            geoLocationDataStore: {
              ...state.geoLocationDataStore,
              errMsg: err.message,
              center: defaultLocation,
              isLoading: false
            }
          }));
        }
      );
    } else {
      set((state) => ({
        geoLocationDataStore: {
          ...state.geoLocationDataStore,
          errMsg: "geolocation을 사용할 수 없어요..",
          center: defaultLocation,
          isLoading: false
        }
      }));
    }
  }
}));

export default useGeoLocationStore;
