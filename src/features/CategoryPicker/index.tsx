import { CategoryEvent } from "~/features/Categories/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CategorySelect } from "~/routes/Index/CategorySelect";
import { useEvent } from "~/utils/events";
import { notifications } from "@mantine/notifications";
import { useCategoryPickerStore } from "./store";
import { useAuth } from "~/providers/Auth/useAuth";

export function CategoryPicker() {
  const rootPath = "";
  const { isLoggedIn } = useAuth();
  const { categories, loading, fetchCategories, fetchPublicCategories, resetState } = useCategoryPickerStore();

  const fetchCategoriesList = isLoggedIn ? fetchCategories : fetchPublicCategories;

  useEffect(() => {
    fetchCategoriesList();
    return () => {
      resetState();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetState();
  }, []);

  // In the future, this event can be renamed to CategoryUpdate if needed
  useEvent(CategoryEvent.CategoryUpdate, (payload) => {
    console.log("CategoriesUpdate event payload:", payload);
    fetchCategoriesList();
  });

  const [pickedCategory, setPickedCategory] = useState("");
  const defaultCategory = pickedCategory || categories[0]?.slug;

  const { main, section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (main === "categories") {
      handleCategoryChange(section);
    }
  }, [main, section]);

  const handleCategoryChange = (value: string | undefined) => {
    value = value || pickedCategory || defaultCategory;
    if (value) {
      setPickedCategory(value);
      return navigate(`${rootPath}/categories/${value}`);
    }
  };

  return (
    <CategorySelect
      category="Categories"
      onCategoryClick={() =>
        defaultCategory
          ? handleCategoryChange(pickedCategory)
          : notifications.show({
              position: "bottom-center",
              title: "No categories at the moment.",
              message: "In order to access Categories, you need to create one.",
            })
      }
      onChange={handleCategoryChange}
      value={defaultCategory}
      data={categories.map((x) => ({ value: x.slug, label: x.name }))}
    />
  );
}
