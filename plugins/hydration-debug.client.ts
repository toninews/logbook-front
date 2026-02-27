export default defineNuxtPlugin((nuxtApp) => {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const first = String(args[0] || "");
    if (first.toLowerCase().includes("hydration")) {
      const routePath =
        nuxtApp.$router?.currentRoute?.value?.fullPath || window.location.pathname;
      console.groupCollapsed(`[HydrationDebug:console] ${routePath}`);
      originalConsoleWarn(...args);
      console.log("stack:", new Error().stack);
      console.groupEnd();
      return;
    }

    originalConsoleWarn(...args);
  };

  const previousWarnHandler = nuxtApp.vueApp.config.warnHandler;

  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    const warning = String(msg || "");
    const isHydrationWarning = warning.toLowerCase().includes("hydration");

    if (isHydrationWarning) {
      const routePath =
        nuxtApp.$router?.currentRoute?.value?.fullPath || window.location.pathname;
      const componentName =
        (instance?.type as { name?: string; __name?: string } | undefined)?.name ||
        (instance?.type as { name?: string; __name?: string } | undefined)?.__name ||
        "anonymous-component";
      const element = instance?.vnode?.el as Element | null;

      console.groupCollapsed(`[HydrationDebug] ${componentName} @ ${routePath}`);
      originalConsoleWarn(warning);
      if (trace) {
        console.log("trace:", trace);
      }
      if (element) {
        console.log("element:", element);
        console.log("element html:", element.outerHTML?.slice(0, 1500));
        if (element.parentElement) {
          console.log(
            "parent html:",
            element.parentElement.outerHTML?.slice(0, 2000),
          );
        }
      }
      console.groupEnd();
    }

    if (previousWarnHandler) {
      previousWarnHandler(msg, instance, trace);
      return;
    }

    originalConsoleWarn(msg);
  };
});
