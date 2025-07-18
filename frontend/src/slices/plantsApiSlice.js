import { PLANTS_URL, UPLOAD_PLANT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const plantsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlants: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PLANTS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Plant"] /** > reloads page */,
      keepUnusedDataFor: 5,
    }),
    getPlantDetails: builder.query({
      query: (plantId) => ({
        url: `${PLANTS_URL}/${plantId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createPlant: builder.mutation({
      query: () => ({
        url: PLANTS_URL,
        method: "POST",
      }),
      invalidatesTags: [
        "Plant",
      ] /* stops it from being cashed (always new data loading to the page) */,
    }),
    updatePlant: builder.mutation({
      query: (data) => ({
        url: `${PLANTS_URL}/${data.plantId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Plant"] /**cleans cash for later reload */,
    }),
    uploadPlantImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_PLANT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deletePlant: builder.mutation({
      query: (plantId) => ({
        url: `${PLANTS_URL}/${plantId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PLANTS_URL}/${data.plantId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plant"],
    }),
    getTopPlants: builder.query({
      query: () => ({
        url: `${PLANTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetPlantsQuery,
  useGetPlantDetailsQuery,
  useCreatePlantMutation,
  useUpdatePlantMutation,
  useUploadPlantImageMutation,
  useDeletePlantMutation,
  useCreateReviewMutation,
  useGetTopPlantsQuery,
} = plantsApiSlice;
