import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const dismissedKey = "water_delivery_install_prompt_dismissed";

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

export const InstallAppPrompt = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    if (isStandaloneApp() || sessionStorage.getItem(dismissedKey) === "true") return;

    const showTimer = window.setTimeout(() => setVisible(true), 1200);
    const fallbackTimer = window.setTimeout(() => setFallbackMode(true), 2200);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.clearTimeout(fallbackTimer);
      setFallbackMode(false);
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      sessionStorage.setItem(dismissedKey, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(dismissedKey, "true");
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) {
      setFallbackMode(true);
      return;
    }
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-border bg-white p-4 shadow-2xl md:left-auto md:right-5 md:mx-0">
      <button
        type="button"
        className="absolute right-3 top-3 rounded-md p-1 text-slate-500 transition hover:bg-muted hover:text-slate-900"
        aria-label="Close install prompt"
        onClick={dismiss}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 pr-8">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-white">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold">Install the water delivery app</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Keep bulk water ordering, dispatch contacts, and delivery tracking one tap away.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {fallbackMode && !installEvent ? (
          <p className="rounded-md bg-muted px-3 py-2 text-xs leading-5 text-slate-700">
            Use your browser menu and choose <span className="font-semibold">Add to Home Screen</span> or{" "}
            <span className="font-semibold">Install app</span>.
          </p>
        ) : (
          <Button type="button" size="sm" onClick={install}>
            <Download className="h-4 w-4" />
            Install App
          </Button>
        )}
        <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
};
