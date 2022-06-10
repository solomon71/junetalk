defmodule JunetalkWeb.PageController do
  use JunetalkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
