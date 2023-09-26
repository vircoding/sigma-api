export const formatUserRes = (user) => {
  const response = {};

  response.credentials.role = user.__t;
  response.posts = user.posts.map((item) => item.post_id);
  response.favorites = user.favorites.map((item) => {
    return {
      id: item.post_id,
      status: item.status,
    };
  });

  if (user.__t === "client") {
    response.info.username = user.info.username;
  } else if (user.__t === "agent") {
    response.info.firstname = user.info.firstname;
    response.info.lastname = user.info.lastname;
    response.info.bio = user.info.bio;
    response.contact_details.public_email = user.contact_details.public_email;
    response.contact_details.whatsapp.code = user.contact_details.whatsapp.code;
    response.contact_details.whatsapp.phone = user.contact_details.whatsapp.phone;
  }

  return response;
};

export const formatPostRes = (post) => {
  const response = {};

  response.type = post.__t;
  response.uid = post.uid;
  response.description = post.description;
  response.contact_details.contact_types.phone = post.contact_details.contact_types.phone;
  response.contact_details.contact_types.whatsapp = post.contact_details.contact_types.whatsapp;
  response.contact_details.contact.code = post.contact_details.contact.code;
  response.contact_details.contact.phone = post.contact_details.contact.phone;
  response.property_details = post.property_details.map((item) => {
    return {
      address: {
        province: item.address.province,
        municipality: item.address.municipality,
      },
      features: {
        bed_room: item.features.bed_room,
        bath_room: item.features.bath_room,
        garage: item.features.garage,
        garden: item.features.garden,
        pool: item.features.pool,
        furnished: item.features.furnished,
      },
    };
  });

  if (post.__t === "sale") {
    response.amount_details.amount = post.amount_details.amount;
    response.amount_details.currency = post.amount_details.currency;
  } else if (post.__t === "rent") {
    response.amount_details.amount = post.amount_details.amount;
    response.amount_details.currency = post.amount_details.currency;
    response.amount_details.frequency = post.amount_details.frequency;
  } else if (post.__t === "exchange") {
    response.offer_details.offers = post.offer_details.offers;
    response.offer_details.needs.enable = post.offer_details.needs.enable;
    response.offer_details.needs.count = post.offer_details.needs.count;
  }

  return response;
};

export const formatAgentRes = (agent) => {
  return {
    id: agent._id,
    info: {
      firstname: agent.info.firstname,
      lastname: agent.info.lastname,
      bio: agent.info.bio,
    },
    contact_details: {
      public_email: agent.contact_details.public_email,
      whatsapp: {
        code: agent.contact_details.whatsapp.code,
        phone: agent.contact_details.whatsapp.phone,
      },
    },
    posts: agent.posts.map((item) => item.post_id),
  };
};
