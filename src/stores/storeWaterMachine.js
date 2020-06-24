import { action, runInAction, observable } from "mobx";

import { statusesClient } from "../constants/statuses";
import { waterMachineData } from "./mocked";

class StoreWaterMachine {
  data = null;

  @observable error = "";
  @observable isLoading = true;

  @action async fetchWaterMachineData(waterMachineId) {
    this.isLoading = true;

    try {
      const response = await fetch(
        `https://gorest.co.in/public-api/posts?access-token=5xyyvsYLlZaryeyq7oHI7776xSbGkUdTWCN7`
      );
      const data = await response.json();

      runInAction(() => {
        // this.data = data.result;
        this.data = waterMachineData;
      });
    } catch (e) {
      this.error = statusesClient.UNDEFINED_ERROR;
    } finally {
      this.isLoading = false;
    }
  }
}

export default StoreWaterMachine;
