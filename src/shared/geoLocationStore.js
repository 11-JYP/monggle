import { create } from 'zustand';

// TODO 임시로 만듦
const geoLocationStore = create((set) => {
  return {
    latitude: 0,
    longitude: 0,
    coordinate: null,
    // addressName: '',
    setLatitude: (latitude) =>
      set(() => {
        return { latitude: latitude };
      }),
    setLongitude: (longitude) => {
      set(() => {
        return { longitude: longitude };
      });
    },
    setCoordinate: (coordinate) => {
      set(() => {
        return { coordinate: coordinate };
      });
    }
    // setAddressName: (addressName) => {
    //   set(() => {
    //     return { addressName: addressName };
    //   });
    // }
  };
});

export default geoLocationStore;
