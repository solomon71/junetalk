defmodule Junetalk.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Junetalk.Repo,
      # Start the Telemetry supervisor
      JunetalkWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Junetalk.PubSub},
      # Start the Endpoint (http/https)
      JunetalkWeb.Endpoint,
      # Start a worker by calling: Junetalk.Worker.start_link(arg)
      {JunetalkWeb.Worker, 30_000}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Junetalk.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    JunetalkWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
