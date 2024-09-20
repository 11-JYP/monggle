import { create } from "zustand";

const userRouteStore = create((set) => ({
  routeFormData: {
    routeName: "",
    address: "",
    description: "",
    selectedPuppy: "default",
    selectedLineColor: "blue"
  },

  setUserRouteData: (data) => set((state) => ({ routeFormData: { ...state.routeFormData, ...data } }))
}));

export default userRouteStore;
