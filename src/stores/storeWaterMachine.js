import { decorate, action, runInAction, observable } from "mobx";

const mockWaterMachineData = {
  automate_number: 123,
  town: "г. Краматорск",
  street: "ул. Академическая",
  phones: ["+380990317398"],
  build: 58,
  price: 99 / 100,
  water_available: 123.5,
  discounts: [
    {
      start_range: 10,
      end_range: 20,
      discount: 20,
    },
    {
      start_range: 20,
      end_range: 30,
      discount: 40,
    },
    {
      start_range: 30,
      end_range: 40,
      discount: 50,
    },
  ],
  status: "OK",
  error: "OK",
};

class StoreWaterMachine {
  @observable data = null;
  @observable error = null;
  @observable isLoading = true;

  @action async fetchWaterMachineData() {
    try {
      const response = await fetch(
        `https://gorest.co.in/public-api/posts?access-token=5xyyvsYLlZaryeyq7oHI7776xSbGkUdTWCN7`
      );
      const data = await response.json();

      runInAction(() => {
        this.data = mockWaterMachineData;
      });
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }
}

// decorate(StoreWaterMachine, {
//   data: observable,
//   error: observable,
//   isLoading: observable,
//   fetchWaterMachineData: action.bound,
// });

export default new StoreWaterMachine();
