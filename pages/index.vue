<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const date = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
});

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const navigateToDate = () => {
  const selectedDate = new Date(
    date.value.year,
    date.value.month - 1,
    date.value.day
  );
  if (
    selectedDate.getFullYear() !== date.value.year ||
    selectedDate.getMonth() + 1 !== date.value.month ||
    selectedDate.getDate() !== date.value.day
  ) {
    alert("Please enter a valid date");
    return;
  }

  router.push(
    `/day/${date.value.year}/${date.value.month < 10 ? "0" : ""}${
      date.value.month
    }/${date.value.day}`
  );
};

const navigateToToday = () => {
  const today = new Date();
  date.value = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  navigateToDate();
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const validateDay = () => {
  const maxDays = getDaysInMonth(date.value.year, date.value.month);
  if (date.value.day > maxDays) {
    date.value.day = maxDays;
  }
};
</script>

<template>
  <main class="home-page">
      <header>
        <h1>Todo App</h1>
        <nav>
          <NuxtLink to="/settings" class="settings-link">
            <i class="pi pi-cog"></i>
            Settings
          </NuxtLink>
        </nav>
      </header>

      <section class="date-selector">
        <h2>Select Date</h2>

        <div class="date-inputs">
          <div class="form-group">
            <label for="year">Year:</label>
            <input
              id="year"
              v-model.number="date.year"
              type="number"
              min="1950"
              max="2050"
              @change="validateDay"
            />
          </div>

          <div class="form-group">
            <label for="month">Month:</label>
            <select
              id="month"
              v-model.number="date.month"
              @change="validateDay"
            >
              <option
                v-for="month in monthOptions"
                :key="month.value"
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="day">Day:</label>
            <input
              id="day"
              v-model.number="date.day"
              type="number"
              min="1"
              :max="getDaysInMonth(date.year, date.month)"
            />
          </div>
        </div>

        <div class="button-group">
          <button class="primary-button" @click="navigateToDate">
            Go to Date
          </button>
          <button class="secondary-button" @click="navigateToToday">
            Go to Today
          </button>
        </div>
      </section>

  </main>
</template>

<style lang="scss">
.home-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow-color);
    padding: 32px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--border-color);

    h1 {
      font-size: 36px;
      color: var(--primary-color);
      font-weight: 700;
    }
  }

  .settings-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    color: var(--primary-color);
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 122, 204, 0.1);
    }

    i {
      font-size: 20px;
    }
  }

  .date-selector {
    max-width: 600px;
    margin: 0 auto 48px;
    padding: 32px;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 24px;
      margin-bottom: 24px;
      text-align: center;
      color: var(--text-color);
    }
  }

  .date-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 500;
      color: var(--text-color);
    }

    input,
    select {
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 16px;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
      }
    }
  }

  .button-group {
    display: flex;
    gap: 16px;
    justify-content: center;

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .primary-button {
      background: var(--primary-color);
      color: white;

      &:hover {
        filter: brightness(110%);
      }
    }

    .secondary-button {
      background: #6c757d;
      color: white;

      &:hover {
        filter: brightness(110%);
      }
    }
  }

}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .home-page {
    .container {
      background: #1e1e1e;
    }

    .date-selector,
    .feature-card {
      background: #262626;
    }

    input,
    select {
      background: #333;
      color: #fff;

      &::placeholder {
        color: #888;
      }
    }

    
  }
}

// Responsive design
@media (max-width: 768px) {
  .home-page {
    .container {
      padding: 20px;
    }

    header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .date-inputs {
      grid-template-columns: 1fr;
    }

    .button-group {
      flex-direction: column;
    }

  }
}

// Print styles
@media print {
  .home-page {
    .container {
      box-shadow: none;
    }

    .button-group,
    .settings-link {
      display: none;
    }
  }
}
</style>
