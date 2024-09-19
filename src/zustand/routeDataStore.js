import { create } from 'zustand';

const routeDataStore = create((set) => ({
  routeData: null,
  setRouteData: (data) => set({ routeData: data })
}));

export default routeDataStore;
