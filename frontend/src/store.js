import {create} from 'zustand';

const useStore = create((set) => ({
  user: localStorage.getItem('token')  || "user not found",
  setUser: (user) => set({ user:user }),
  //setUserToken: (token) => set({ token }),
  tweets: [],
  setTweets: (tweets) => set({ tweets }),
  addTweet: (tweet) => set((state) => ({ tweets: [...state.tweets, tweet] })),
  removeTweet: (id) => set((state) => ({ tweets: state.tweets.filter((tweet) => tweet.id !== id) })),
}));

export default useStore;
