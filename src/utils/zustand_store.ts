import { create } from "zustand";
import supabase from "./supabase";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

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

export interface ChatData {
  id: number;
  sender_user_id: string;
  receiver_user_id: string;
  status: string;
  created_at: string;
  messages: MessageData[];
}

export interface MessageData {
  id: number;
  chat_id: number;
  message: string;
  user_id: string;
  created_at: Date;
  attachment_urls: null;
}

export interface ProductData {
  name: string;
  description: string;
  brand: string;
  original_price: number;
  discounted_price: number;
  image: string;
  quantity: number;
}

interface StoreTypes {
  isUserDataLoading: boolean;
  user: User | null;
  theme: string;
  showToast: (text: string, type: "success" | "error") => void;
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
  globalChannel: any | null;
  onlineUsers: {
    [userId: string]: {
      name: string;
      user_id: string;
      presence_ref: string;
    }[];
  } | null;
  userTyping: { user_id: string; isTyping: boolean } | null;
  createGlobalChannel: () => void;
  sendTyping: (isTyping: boolean) => void;
  chatLoading: boolean;
  getChat: () => Promise<{
    data: ChatData[] | null;
    error: any;
  }>;
  newMessage: MessageData | null;
  subscribeToChat: () => void;
  isLoadingSendMessage: boolean;
  sendMessage: (
    chat_id: number,
    message: string
  ) => Promise<{ data: any; error: any }>;
  isLoadingAddProduct: boolean;
  addProduct: (productData: ProductData) => Promise<{ data: any; error: any }>;
  isLoadingUploadFile: boolean;
  uploadFile: (file: File) => Promise<{ publicUrl: string }>;
}

const useStore = create<StoreTypes>((set, get) => ({
  isUserDataLoading: true,
  user: null,
  theme: "light",
  showToast: (text, type) => {
    toast[type](text);
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
      .eq("cart.user_id", get().user?.id)
      .order("id", { ascending: false });
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

  globalChannel: null,
  onlineUsers: null,
  userTyping: null,
  createGlobalChannel: async () => {
    const channel = supabase.channel("global-channel", {
      config: {
        presence: { key: get().user?.id },
      },
    });

    set({ globalChannel: channel });
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({
          user_id: get().user?.id,
          name: get().user?.user_metadata?.name,
        });
      }
    });
    channel.on("presence", { event: "sync" }, () => {
      set({ onlineUsers: channel.presenceState() });
    });
    channel.on("broadcast", { event: "typing" }, (payload) => {
      set({ userTyping: payload?.payload });
    });
  },
  sendTyping: (isTyping: boolean) => {
    get().globalChannel.send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: get().user?.id, isTyping },
    });
  },
  chatLoading: false,
  getChat: async () => {
    set({ chatLoading: true });
    const { data, error } = await supabase
      .from("chats")
      .select(`*, messages(*)`)
      .match({
        sender_user_id: "48dff567-670b-458d-a06c-ccb729e8b5ba",
        receiver_user_id: "f8c2da7f-6722-4bc7-953b-8f6c108ebe14",
      });
    set({ chatLoading: false });
    return { data, error };
  },
  newMessage: null,
  subscribeToChat: () => {
    supabase
      .channel("message-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          set({ newMessage: payload?.new as MessageData });
        }
      )
      .subscribe();
  },
  isLoadingSendMessage: false,
  sendMessage: async (chat_id, message) => {
    set({ isLoadingSendMessage: true });
    const { data, error } = await supabase
      .from("messages")
      .insert([{ chat_id, message, user_id: get().user?.id }]);
    set({ isLoadingSendMessage: false });
    return { data, error };
  },
  isLoadingAddProduct: false,
  addProduct: async (productData) => {
    set({ isLoadingAddProduct: true });
    const { data, error } = await supabase
      .from("products")
      .insert([productData]);
    set({ isLoadingAddProduct: false });
    return { data, error };
  },
  isLoadingUploadFile: false,
  uploadFile: async (file) => {
    set({ isLoadingUploadFile: true });
    const { data, error } = await supabase.storage
      .from("test-bucket")
      .upload(`/product-images/${Date.now()}+${file?.name}`, file);
    set({ isLoadingUploadFile: false });
    if (error) {
      get().showToast(
        "Error while uploading image: " + error?.message,
        "error"
      );
      return { publicUrl: "" };
    } else {
      const { data: data1 } = await supabase.storage
        .from("test-bucket")
        .getPublicUrl(data?.path);
      return { publicUrl: data1?.publicUrl };
    }
  },
}));

export default useStore;
