import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./person.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

const API_KEY= import.meta.env.VITE_API_KEY;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Person = () => {
  const { personId } = useParams(); // Get the person ID from the URL
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null); // For combined credits (movies + TV shows)
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch person details from TMDb API
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error("Failed to fetch person details:", error);
      }
    };

    // Fetch combined credits (movies and TV shows)
    const fetchPersonCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        console.log("Credits data:", data); // Debugging
        setCredits(data);
      } catch (error) {
        console.error("Failed to fetch person credits:", error);
      }
    };

    fetchPersonDetails();
    fetchPersonCredits();
  }, [personId]);

  if (!person) {
    return <p>Loading...</p>;
  }

  // Filter known for movies/TV shows
  const knownForItems = credits?.cast?.filter((item) => item.poster_path) || [];

  // Filter and limit crew members for display
  const crewToDisplay =
    credits?.crew?.filter(
      (crewMember) => crewMember.profile_path && crewMember.name && crewMember.id
    ).slice(0, 12) || [];

  return (
    <div className="total">
    <div className="person-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back To Movie Title
      </button>
      <div className="person-details">
        <img
          src={
            person.profile_path
              ? `${IMAGE_BASE_URL}${person.profile_path}`
              : "/images/default-avatar.png"
          }
          alt={person.name}
          className="person-image"
        />
        <div className="person-info">
          <h1>{person.name || "Unknown"}</h1>
          <div className="info-grid">
            <p>
              <strong>Known for:</strong> {person.known_for_department || "Unknown"}
            </p>
            <p>
              <strong>Birthday:</strong>{" "}
              {person.birthday
                ? `${person.birthday} (${new Date().getFullYear() -
                    new Date(person.birthday).getFullYear()} years old)`
                : "Unknown"}
              {person.deathday && ` - ${person.deathday}`}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {person.gender === 2
                ? "Male"
                : person.gender === 1
                ? "Female"
                : "Unknown"}
            </p>
            <p>
              <strong>Birthplace:</strong> {person.place_of_birth || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      <div className="biography-section">
        <h2 className="bio-title">Biography</h2>
        <div className="bio-line"></div>
        <p className="bio-text">
          {person.biography || "No biography available."}
        </p>
      </div>

      {/* Known For Section */}
      <div className="known-for-section">
        <h2 className="section-title">Known For</h2>
        <Swiper
          spaceBetween={10}
          slidesPerView={6}
          navigation
          className="known-for-swiper"
        >
          {knownForItems.map((item, index) => (
            <SwiperSlide
              key={`${item.id}-${index}`}
              className="known-for-slide"
              onClick={() => navigate(`/movie/${item.id}`)}
            >
              <img
                src={`${IMAGE_BASE_URL}${item.poster_path}`}
                alt={item.title || item.name}
                className="known-for-image"
              />
              <p className="known-for-title">{item.title || item.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Similar Crew Members Section */}
      {crewToDisplay.length > 0 ? (
        <div className="similar-crew-section">
          <h2 className="section-title">Similar Crew Members</h2>
          <Swiper
            spaceBetween={10}
            slidesPerView={6}
            navigation
            className="similar-crew-swiper"
          >
            {crewToDisplay.map((crewMember, index) => (
              <SwiperSlide
                key={`${crewMember.id}-${index}`}
                className="similar-crew-slide"
                onClick={() => navigate(`/person/${crewMember.id}`)}
              >
                <div className="crew-item">
                  <img
                    src={`${IMAGE_BASE_URL}${crewMember.profile_path}`}
                    alt={crewMember.name}
                    className="crew-image"
                  />
                  <p className="crew-name">{crewMember.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="no-crew-message">No similar crew members found.</p>
      )}
    </div>
    </div>
  );
};

export default Person;
