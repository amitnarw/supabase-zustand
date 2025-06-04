import { create } from "zustand";
import supabase from "./supabase";
import { toast } from "sonner";

export interface OrdersData {
  id: number;
  user_id: string;
  total_amount: number;
  house: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: number;
  created_at: Date;
  order_items: [
    {
      id: number;
      name: string;
      brand: string;
      image: string;
      price: number;
      order_id: number;
      quantity: number;
      created_at: Date;
      product_id: number;
      description: string;
    }
  ];
  payments: [
    {
      id: number;
      status: string;
      order_id: number;
      created_at: Date;
      session_id: Date;
      payment_intent: string;
    }
  ];
}

export interface ProductList {
  id: number;
  created_at: Date;
  cart: [
    {
      product_id: number;
    }
  ];
  name: string;
  description: string;
  brand: string;
  original_price: number;
  discounted_price: number;
  image: string;
  avg_rating: number;
  quantity: number;
}

export interface CartItems {
  id: number;
  product_id: number;
  user_id: string;
  quantity: number;
  products: {
    id: number;
    name: string;
    brand: string;
    image: string;
    quantity: number;
    avg_rating: string;
    description: string;
    original_price: number;
    discounted_price: number;
  };
}

interface StoreTypes {
  isUserDataLoading: boolean;
  user: any | null;
  theme: string;
  showToast: (value: string) => void;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (state: number) => void;
  setPageSize: (state: number) => void;

  setUserData: (data: any, sessionData: any) => void;
  initializeUser: () => void;
  checkUserSessionLocal: () => void;
  setTheme: (theme: string) => void;
  logout: () => void;

  isAllProductLoading: boolean;
  allProducts: {
    data: ProductList[] | null;
    count: number | null;
    error: any;
  };
  getAllProduct: () => Promise<{
    data: ProductList[] | null;
    count: number | null;
    error: any;
  }>;

  cartData: {
    data: CartItems[] | null;
    count: number | null;
    error: any;
  };
  isGetCartLoading: boolean;
  getCart: () => Promise<{
    data: CartItems[] | null;
    count: number | null;
    error: any;
  }>;

  addToCartLoading: boolean;
  addToCart: (product_id: number) => void;
  removeFromCart: (product_id: number) => void;
  changeQuantity: (product_id: number, quantity: number) => void;
  isCheckoutLoading: boolean;
  handleCheckout: (
    structuredData: any,
    total_amount: number
  ) => Promise<{ data: any; error: any }>;
  paymentStatus: string | null;
  paymentChannel: any;
  handleCheckStatus: (session_id: string) => void;
  unsubscribePaymentChannel: () => void;
  checkPaymentStatusDatabase: (
    session_id: string
  ) => Promise<{ data: any; error: any }>;
  isAllOrdersLoading: boolean;
  getAllOrders: () => Promise<{
    data: OrdersData[] | null;
    error: any;
  }>;
}

const useStore = create<StoreTypes>((set, get) => ({
  isUserDataLoading: true,
  user: null,
  theme: "light",
  showToast: (value) => {
    toast(value);
  },
  error: null,
  page: 1,
  pageSize: 9,
  setPage: (state: number) => set({ page: state }),
  setPageSize: (state: number) => set({ pageSize: state }),

  setUserData: (userData: any) => {
    set({ user: userData });
  },
  initializeUser: async () => {
    set({ isUserDataLoading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    set({ user: user ?? null, isUserDataLoading: false });
  },

  checkUserSessionLocal: async () => {
    set({ isUserDataLoading: true });
    const { data } = await supabase.auth.getSession();
    set({
      user: data?.session?.user,
      isUserDataLoading: false,
    });
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
    set({ user: null });
  },
  isAllProductLoading: false,
  allProducts: {
    data: null,
    count: null,
    error: "",
  },
  getAllProduct: async () => {
    set({ isAllProductLoading: true });
    const { data, error, count } = await supabase
      .from("products")
      .select(`*, cart (user_id, product_id)`, { count: "exact" })
      .range((get().page - 1) * get().pageSize, get().page * get().pageSize - 1)
      .eq("cart.user_id", get().user.id);
    set({ isAllProductLoading: false, allProducts: { data, count, error } });
    return { data, count, error };
  },

  cartData: {
    data: null,
    count: null,
    error: "",
  },
  isGetCartLoading: false,
  getCart: async () => {
    set({ isGetCartLoading: true });
    const { error, data, count } = await supabase
      .from("cart")
      .select(`*, products (*)`, { count: "exact" })
      .eq("user_id", get().user?.id)
      .order("id", { ascending: true });
    set({
      isGetCartLoading: false,
    });
    set({
      cartData: { data, count, error },
    });
    return { data, error, count };
  },
  cartItems: [],
  addToCartLoading: false,
  addToCart: async (product_id: number) => {
    set({ addToCartLoading: true });
    const { error } = await supabase
      .from("cart")
      .insert({ user_id: get().user?.id, product_id, quantity: 1 });
    if (error) {
      set({
        error: error?.message ?? "ERROR",
      });
    } else {
      get().getCart();
      get().getAllProduct();
    }
    set({ addToCartLoading: true });
  },
  removeFromCart: async (product_id: number) => {
    set({ addToCartLoading: true });
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("product_id", product_id);
    if (error) {
      set({
        error: error?.message ?? "ERROR",
      });
    } else {
      get().getCart();
      get().getAllProduct();
    }
    set({ addToCartLoading: true });
  },
  changeQuantity: async (product_id: number, quantity: number) => {
    set({ addToCartLoading: true });
    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("product_id", product_id);
    if (error) {
      set({
        error: error?.message ?? "ERROR",
      });
    } else {
      get().getCart();
    }
    set({ addToCartLoading: false });
  },
  isCheckoutLoading: false,
  handleCheckout: async (structuredData: any, total_amount: number) => {
    set({ isCheckoutLoading: true });
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: {
        products: structuredData,
        customerEmail: get().user?.email,
        user_id: get().user?.id,
        total_amount,
      },
    });
    set({ isCheckoutLoading: false });
    return { data, error };
  },
  paymentStatus: null,
  paymentChannel: null,
  handleCheckStatus: async (session_id: string) => {
    if (get().paymentChannel) {
      await get().paymentChannel.unsubscribe;
    }
    const paymentUpdate = await supabase
      .channel("paymentChannel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `session_id=eq.${session_id}`,
        },
        async (payload) => {
          const newStatus = payload.new.status;
          set({ paymentStatus: newStatus });
          if (newStatus === "Completed" || newStatus === "Failed") {
            paymentUpdate.unsubscribe();
            set({ paymentChannel: null });
          }
        }
      )
      .subscribe();
    set({ paymentChannel: paymentUpdate });
  },
  unsubscribePaymentChannel: async () => {
    if (get().paymentChannel) {
      await get().paymentChannel.unsubscribe();
      set({ paymentChannel: null });
    }
  },
  checkPaymentStatusDatabase: async (session_id: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("session_id", session_id);
    return { data, error };
  },
  isAllOrdersLoading: false,
  getAllOrders: async () => {
    set({ isAllOrdersLoading: true });
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*), payments (*)`)
      .eq("user_id", get().user?.id);
    set({ isAllOrdersLoading: false });
    return { data, error };
  },
}));

export default useStore;
