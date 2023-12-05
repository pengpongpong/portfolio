import { create } from "zustand"

type CookieModal = {
    open: boolean,
    setOpen: (bool: boolean) => void
}

// store for cookie settings modal
export const useCookieModal = create<CookieModal>((set) => ({
    open: false,
    setOpen: (bool) => set((state) => ({ open: bool }))
}))

export const setOpen = (bool: boolean) => {
    useCookieModal.getState().setOpen(bool)
}