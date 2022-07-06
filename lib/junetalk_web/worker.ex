defmodule JunetalkWeb.Worker do
  use GenServer

  def start_link(arg) do
    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  def init(arg) do
    IO.puts(arg)
    do_something(arg)

    Supervisor.init([], strategy: :one_for_one)

  end

  def do_something(arg) do
    :timer.apply_interval(arg, JunetalkWeb.RoomChannel, :heartbeat, ["😎"])
  end
end
