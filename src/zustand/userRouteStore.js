import { create } from "zustand";

const userRouteStore = create((set) => ({
  routeFormData: {
    routeName: "",
    address: "",
    description: "",
    selectedPuppy: "smallPuppy",
    selectedLineColor: "#FF7F50"
  },

  setUserRouteData: (data) => set((state) => ({ routeFormData: { ...state.routeFormData, ...data } }))
}));

export default userRouteStore;
