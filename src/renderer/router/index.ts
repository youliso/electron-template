import appRoutes from "./app";
import dialogRoutes from "./dialogs";

export function router(el: string) {
    switch (el) {
        case "app":
            return appRoutes;
        case "dialog":
            return dialogRoutes;
    }
}
