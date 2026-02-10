import { create } from 'zustand';

export interface UserProfile {
  age: number;
  isSeoulResident: boolean;
  isHouseOwner: boolean;
  householdType: 'single' | 'with_parents';
  employmentStatus: 'unemployed' | 'short_term' | 'full_time';
  monthlyIncome: number;
  isStudent: boolean;
  isGraduate: boolean;
  rentDeposit: number;
  monthlyRent: number;
  transitUsageCount: number;
  hasReceivedSupport: string[];
  caregiver: boolean;
  isFosterYouth: boolean;
}

interface StoreState {
  userProfile: Partial<UserProfile>;
  currentQuestion: number;
  updateProfile: (data: Partial<UserProfile>) => void;
  setCurrentQuestion: (question: number) => void;
  resetProfile: () => void;
}

const initialProfile: Partial<UserProfile> = {
  age: 25,
  isSeoulResident: true,
  isHouseOwner: false,
  householdType: 'single',
  employmentStatus: 'full_time',
  monthlyIncome: 2500000,
  isStudent: false,
  isGraduate: false,
  rentDeposit: 0,
  monthlyRent: 0,
  transitUsageCount: 0,
  hasReceivedSupport: [],
  caregiver: false,
  isFosterYouth: false,
};

export const useStore = create<StoreState>((set) => ({
  userProfile: initialProfile,
  currentQuestion: 0,
  updateProfile: (data) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...data },
    })),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  resetProfile: () => set({ userProfile: initialProfile, currentQuestion: 0 }),
}));
