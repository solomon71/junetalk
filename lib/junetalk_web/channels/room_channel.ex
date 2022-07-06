defmodule JunetalkWeb.RoomChannel do
  use JunetalkWeb, :channel

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    IO.inspect(payload)
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("synth_assign", %{"body" => synth}, socket) do
    socket = assign(socket, :synth, synth)
    {:reply, {:ok, synth}, socket}
  end

  def handle_in("clowndown", %{"body" => body}, socket) do
    broadcast!(socket, "clowndown", %{body: body, synth: socket.assigns.synth})
    {:noreply, socket}
  end

  def handle_in("clownup", %{"body" => body}, socket) do
    broadcast!(socket, "clownup", %{body: body, synth: socket.assigns.synth})
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  @impl true
  def handle_info("zzz", socket) do
    IO.puts("zzz")
    {:noreply, socket}
  end

  def heartbeat(arg) do
    IO.puts(arg)
    JunetalkWeb.Endpoint.local_broadcast_from(self(), "room:lobby", "zzz", %{})
    {:noreply}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
