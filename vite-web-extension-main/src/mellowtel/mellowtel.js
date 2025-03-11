import Mellowtel from "mellowtel";

(async () => {
    const mellowtel = new Mellowtel(import.meta.env.MELLOWTEL_CONFIGURATION_KEY);
    await mellowtel.initContentScript();
})();