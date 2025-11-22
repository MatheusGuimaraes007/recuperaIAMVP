<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import Card from "../../shared/Card.vue";
import { formatDate, formatCurrency } from "../../utils/formatters";

const router = useRouter();

const props = defineProps({
  clients: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["client-click"]);

const handleClientClick = (client) => {
  router.push(`/admin/dashboard/${client.id}`);
};

const getStatusConfig = (status) => {
  const configs = {
    active: {
      label: "Ativo",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: "✅",
    },
    trial: {
      label: "Trial",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      icon: "🔄",
    },
    suspended: {
      label: "Suspenso",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      icon: "⏸️",
    },
    canceled: {
      label: "Cancelado",
      color: "#6b7280",
      bgColor: "rgba(107, 114, 128, 0.1)",
      icon: "❌",
    },
  };

  return configs[status] || configs.trial;
};

const hasClients = computed(() => props.clients && props.clients.length > 0);
</script>

<template>
  <div>
    <Card padding="none" class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="relative">
            <div
              class="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50"
            ></div>
            <tr class="border-b-2" style="border-color: var(--color-border1)">
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Cliente
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Status
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Oportunidades
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recuperado
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Data Cadastro
                </span>
              </th>
              <th
                class="relative px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <span class="flex items-center justify-end gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Ações
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" style="border-color: var(--color-border1)">
            <tr
              v-for="client in clients"
              :key="client.id"
              @click="handleClientClick(client)"
              class="group hover:bg-gradient-to-r hover:from-gray-800/40 hover:to-transparent transition-all duration-200 cursor-pointer relative"
            >
              <td class="px-6 py-4 relative">
                <div
                  class="absolute inset-y-0 left-0 w-1 bg-[#7cba10] opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>

                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div
                      class="absolute -inset-0.5 bg-gradient-to-r from-[#7cba10] to-[#5a8c0d] rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"
                    ></div>
                    <div
                      class="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform group-hover:scale-110"
                      style="
                        background: linear-gradient(
                          135deg,
                          #7cba10 0%,
                          #5a8c0d 100%
                        );
                      "
                    >
                      {{ client.name?.charAt(0)?.toUpperCase() || "?" }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p
                      class="text-white font-semibold truncate group-hover:text-[#7cba10] transition-colors"
                    >
                      {{ client.name || "Sem nome" }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <a
                  :href="`mailto:${client.email}`"
                  @click.stop
                  class="text-sm text-white flex items-center gap-1.5 hover:text-[#7cba10] transition-colors w-fit"
                >
                  <span class="font-medium truncate max-w-[200px]">{{
                    client.email
                  }}</span>
                </a>
              </td>

              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all group-hover:scale-105"
                  :style="{
                    color: getStatusConfig(client.status).color,
                    backgroundColor: getStatusConfig(client.status).bgColor,
                    border: `1.5px solid ${
                      getStatusConfig(client.status).color
                    }40`,
                  }"
                >
                  <span class="text-base">{{
                    getStatusConfig(client.status).icon
                  }}</span>
                  <span>{{ getStatusConfig(client.status).label }}</span>
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white">
                      {{ client.metrics?.totalOpportunities || 0 }}
                    </p>
                    <p class="text-xs text-gray-400">total</p>
                  </div>
                  <div class="h-8 w-px bg-gray-700"></div>
                  <div class="text-center">
                    <p class="text-lg font-semibold text-green-400">
                      {{ client.metrics?.wonOpportunities || 0 }}
                    </p>
                    <p class="text-xs text-gray-400">ganhas</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-semibold text-gray-400">
                      {{ client.metrics?.conversionRate || 0 }}%
                    </p>
                    <p class="text-xs text-gray-500">taxa</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-lg font-bold text-green-400">
                    {{ formatCurrency(client.metrics?.totalRecovered || 0) }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-sm text-gray-400 font-medium">{{
                    formatDate(client.created_at)
                  }}</span>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  @click.stop="handleClientClick(client)"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style="
                    background: linear-gradient(
                      135deg,
                      #7cba10 0%,
                      #5a8c0d 100%
                    );
                  "
                >
                  <span>Acessar Dashboard</span>
                  <svg
                    class="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-6 py-5 border-t bg-gradient-to-r from-gray-800/20 to-transparent"
        style="border-color: var(--color-border1)"
      >
        <slot name="pagination"></slot>
      </div>
    </Card>
  </div>
</template>

<style scoped>
tbody tr {
  animation: fadeInRow 0.3s ease-out;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

tbody tr:hover {
  transform: translateX(2px);
}

a {
  position: relative;
}

a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

a:hover::after {
  width: 100%;
}
</style>