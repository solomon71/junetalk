defmodule Junetalk.Repo do
  use Ecto.Repo,
    otp_app: :junetalk,
    adapter: Ecto.Adapters.Postgres
end
