import { create } from "zustand";
import supabase from "./supabase";

interface StoreTypes {
  user: any | null;
  theme: string;
  isStateLoading: boolean;
  productList: {
    id: 1;
    created_at: Date;
    name: string;
    description: string;
    brand: string;
    original_price: number;
    discounted_price: number;
    image: string;
    avg_rating: number;
    quantity: number;
  }[];
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  count: number;
  setIsStateLoading: (value: boolean) => void;
  authStateChange: () => void;
  initializeUser: () => void;
  setTheme: (theme: string) => void;
  logout: () => void;
  getAllProduct: () => void;
}

const useStore = create<StoreTypes>((set, get) => ({
  user: null,
  theme: "light",
  isStateLoading: true,
  productList: [],
  error: null,
  page: 1,
  pageSize: 9,
  setPage: (state: number) => set({ page: state }),
  setPageSize: (state: number) => set({ pageSize: state }),
  count: 0,
  setIsStateLoading: (state: boolean) => set({ isStateLoading: state }),
  authStateChange: async () => {
    supabase.auth.onAuthStateChange((_, session) => {
      set({ user: session?.user ?? null, isStateLoading: false });
    });
  },
  initializeUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    set({ user: user ?? null, isStateLoading: false });
  },
  setTheme: (theme: string) => {
    set(() => ({ theme }));
    if (theme === "light") {
      window.document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      window.document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  },

  logout: async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error?.message);
    }
    set({ user: null, isStateLoading: false });
  },
  getAllProduct: async () => {
    console.log("first");
    set({ isStateLoading: true });
    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(
        (get().page - 1) * get().pageSize,
        get().page * get().pageSize - 1
      );

    if (error) {
      set({
        error: error?.message ?? "ERROR",
        isStateLoading: false,
      });
    } else {
      set({ productList: data, isStateLoading: false, count: count ?? 0 });
    }
  },
}));

export default useStore;
