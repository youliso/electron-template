import appRoutes from "./app";
import dialogRoutes from "./dialogs";

const router = (el: string) => {
    switch (el) {
        case "app":
            return appRoutes;
        case "dialog":
            return dialogRoutes;
    }
}

export {router, appRoutes, dialogRoutes};