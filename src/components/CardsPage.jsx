import { useEffect, useState } from "react";

const PER_PAGE = 6;

const difficultyDot = {
  Easy: "bg-green-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

const Flame = ({ className = "", animate = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} ${animate}`}
    style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
    aria-hidden="true"
  >
    <path
      d="M12 2c.6 3.6 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.8 1.6-4.2 2.6-6.2C10.2 9 11 9 12 2z"
      fill="currentColor"
    />
    <path
      d="M12 12c.4 1.8 2.5 2.7 2.5 4.6a2.5 2.5 0 0 1-5 0c0-1.4.9-2 1.4-3 .5.5.9.5 1.1-1.6z"
      fill="#fff"
      opacity="0.85"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const PeopleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.5A6.5 6.5 0 0 1 21.5 20" />
  </svg>
);

const CardsPage = () => {
  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMeal, setActiveMeal] = useState("All");
  const [page, setPage] = useState(1);
  const [ordered, setOrdered] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://dummyjson.com/recipes");

      if (!response.ok) {
        throw new Error("We could not load the menu. Please try again.");
      }

      const data = await response.json();
      setRecipe(data.recipes);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mealTypes = ["All", ...new Set(recipe.flatMap((r) => r.mealType))];

  const filtered =
    activeMeal === "All"
      ? recipe
      : recipe.filter((r) => r.mealType.includes(activeMeal));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  const handleFilter = (type) => {
    setActiveMeal(type);
    setPage(1);
  };

  const goToPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleOrder = (id) =>
    setOrdered((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );

  const Header = (
    <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-char/10">
      <div className="max-w-285 mx-auto px-5 h-16 flex items-center justify-between">
        <a href="/" className="group flex items-center gap-2">
          <Flame
            className="size-7 text-ember"
            animate="group-hover:animate-flicker"
          />
          <span className="font-display text-2xl font-semibold tracking-tight text-char">
            Salt<span className="text-ember">Fire</span>
          </span>
        </a>

        <div className="flex items-center gap-3 text-sm text-char/70">
          <span>Your order -</span>
          <span
            key={ordered.length}
            className="grid place-items-center min-w-8 h-8 rounded-full bg-char text-paper px-2 font-medium animate-pop"
          >
            {ordered.length}
          </span>
        </div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-paper font-body">
        {Header}
        <main className="max-w-285 mx-auto px-5 py-16">
          <div className="flex flex-col items-center text-center" role="status">
            <Flame className="size-14 text-ember" animate="animate-flicker" />
            <h1 className="font-display text-4xl text-char mt-4">
              Lighting the grill
            </h1>
            <p className="text-char/60 mt-2">Your menu is almost ready.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-3 border border-char/5"
              >
                <div className="h-56 rounded-2xl animate-shimmer" />
                <div className="p-3 space-y-3">
                  <div className="h-6 w-3/4 rounded-full animate-shimmer" />
                  <div className="h-4 w-1/2 rounded-full animate-shimmer" />
                  <div className="h-11 w-full rounded-full animate-shimmer mt-4" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper font-body flex flex-col">
        {Header}
        <main className="flex-1 grid place-items-center px-5 py-16">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="relative">
              <Flame className="size-20 text-char/25" animate="animate-sway" />
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-0 size-3 rounded-full bg-char/20 animate-smoke"
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
              ))}
            </div>

            <h1 className="font-display text-4xl text-char mt-6 animate-fade-up">
              The fire went out
            </h1>
            <p
              className="text-char/60 mt-3 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              {error}
            </p>
            <button
              onClick={fetchData}
              className="mt-8 h-12 px-8 rounded-full bg-char text-paper font-medium cursor-pointer hover:bg-ember hover:-translate-y-0.5 active:scale-95 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Light it again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-body text-char">
      {Header}

      <section className="bg-linear-to-b from-sand to-paper">
        <div className="max-w-285 mx-auto px-5 pt-20 pb-14 text-center">
          <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-[1.05] animate-fade-up">
            Fire-
            <span className="text-ember font-body tracking-wide">cooked</span> ,
            Salt-
            <span className="text-ember font-body tracking-wide">finished</span>
            .
          </h1>
          <p
            className="text-char/65 text-lg mt-5 max-w-md mx-auto animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {recipe.length} dishes from around the world, made{" "}
            <span className="text-ember/60">fresh</span> every day.
          </p>

          <div
            className="flex flex-wrap justify-center gap-2 mt-10 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilter(type)}
                className={`h-11 px-6 rounded-full text-sm font-medium cursor-pointer border transition-all duration-300 hover:-translate-y-0.5 ${
                  activeMeal === type
                    ? "bg-char text-paper border-char"
                    : "bg-white text-char border-char/10 hover:border-ember hover:text-ember"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-285 mx-auto px-5 pt-6 pb-20">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((obj, i) => {
            const isOrdered = ordered.includes(obj.id);

            return (
              <article
                key={obj.id}
                className="group flex flex-col bg-white rounded-3xl p-3 border border-char/5 shadow-sm hover:border-ember/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="relative h-56 overflow-hidden rounded-2xl">
                  <img
                    src={obj.image}
                    alt={obj.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <span className="absolute top-3 left-3 bg-white/95 text-sm font-medium rounded-full px-3 py-1 shadow-sm">
                    <span className="text-ember">★</span> {obj.rating}{" "}
                    <span className="text-char/50">({obj.reviewCount})</span>
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-3">
                  <p className="text-sm text-ember font-medium">
                    {obj.cuisine}
                  </p>
                  <h2 className="font-display text-2xl leading-tight mt-1">
                    {obj.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-char/70">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon />
                      {obj.prepTimeMinutes + obj.cookTimeMinutes} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PeopleIcon />
                      Serves : {obj.servings}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`size-2.5 rounded-full ${
                          difficultyDot[obj.difficulty] || "bg-char/30"
                        }`}
                      />
                      {obj.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleOrder(obj.id)}
                    className={`mt-6 h-12 w-full rounded-full font-medium cursor-pointer active:scale-95 transition-all duration-300 ${
                      isOrdered
                        ? "bg-ember text-white"
                        : "bg-sand text-char hover:bg-ember hover:text-white"
                    }`}
                  >
                    {isOrdered ? "Ordered" : "Order now"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="h-11 px-6 rounded-full bg-char text-paper font-medium cursor-pointer hover:bg-ember transition-colors duration-300 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-char"
            >
              Previous
            </button>

            <span className="text-char/60 text-sm text-nowrap">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="h-11 px-6 rounded-full bg-char text-paper font-medium cursor-pointer hover:bg-ember transition-colors duration-300 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-char"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CardsPage;
