import {create} from 'zustand';

const useStore = create((set) => ({
  user: localStorage.getItem('token')  || "user not found",
  userName : "",
  setUser: (user) => set({ user:user }),
  setUserName : (userName) => set({ userName:userName }),
  //setUserToken: (token) => set({ token }),
  tweets: [],
  setTweets: (tweets) => set({ tweets }),
  addTweet: (tweet) => set((state) => ({ tweets: [...state.tweets, tweet] })),
  removeTweet: (id) => set((state) => ({ tweets: state.tweets.filter((tweet) => tweet.id !== id) })),

  trendingTopics: [], 
  setTrendingTopics: (topics) => set({ trendingTopics: topics }),
}));

export default useStore;
