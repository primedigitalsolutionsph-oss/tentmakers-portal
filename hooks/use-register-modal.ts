import { create } from 'zustand';

export type RegisterStep = 'prerequisite' | 'options' | 'details' | 'success';

export interface RegisterData {
  email: string;
  role: string | null;
  referral: string;
}

interface RegisterModalStore {
  isOpen: boolean;
  currentStep: RegisterStep;
  data: RegisterData;
  onOpen: () => void;
  onClose: () => void;
  goToStep: (step: RegisterStep) => void;
  updateData: (data: Partial<RegisterData>) => void;
  reset: () => void;
}

const initialData: RegisterData = {
  email: '',
  role: null,
  referral: '',
};

export const useRegisterModal = create<RegisterModalStore>()((set) => ({
  isOpen: false,
  currentStep: 'prerequisite',
  data: initialData,
  onOpen: () => set({ isOpen: true, currentStep: 'prerequisite' }),
  onClose: () => set({ isOpen: false }),
  goToStep: (step) => set({ currentStep: step }),
  updateData: (partial) =>
    set((state) => ({
      data: { ...state.data, ...partial },
    })),
  reset: () => set({ isOpen: false, currentStep: 'prerequisite', data: initialData }),
}));
