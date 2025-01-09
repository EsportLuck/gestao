export class localStorageController {
  static PREFIX = "Gestao_";
  static setItemWithExpiry(key: string, value: any, expiryMinutes: number) {
    try {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + expiryMinutes * 60 * 1000,
      };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error("localstorageController setItemWithExpiry", error);
    }
  }
  static getItemWithExpiry(key: string) {
    try {
      const itemStr = localStorage.getItem(this.PREFIX + key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      if (now > item.expiry) {
        localStorage.removeItem(this.PREFIX + key);
        return null;
      }
      return {
        value: item.value,
        expiry: item.expiry,
      };
    } catch (error) {
      alert("Erro ao obter item do localStorage");
      console.error("getItemWithExpiry", error);
      return null;
    }
  }
  static clearExpiredItems() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item = JSON.parse(itemStr);
            const now = new Date().getTime();
            if (now > item.expiry) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error("clearExpiredItems", error);
    }
  }
}
