/*
 * Copyright © 2016 Ladr, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.ladr.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.getlocationipmappings.output.ServerLocIpInfoBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.getlocationipmappings.output.ServerLocIpInfo;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.model.Document;
import com.cloudant.client.api.model.Response;

//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;

public class LocationService {
    private static final String dataFileLocation = "/usr/local/ladr/latLongFile.txt";
    private static final String ACCOUNT = "jsivapra";
    private static final String USERNAME = "jsivapra";
    private static final String PASSWORD = "jsivapra#cmpe295b";
    private static final String DB_NAME = "ladr";

    private static LocationService instance;

    private LocationService() {
        populateLocationMapFromDB();
        //populateLocationMapFromDataFile();
    }

    public static LocationService getInstance() {
        if (null == instance) {
            instance = new LocationService();
        }
        return instance;
    }


    public static Map<String, ArrayList<Server>> locationMap = new HashMap<>();

    ArrayList<Server> getAllServers() {
        ArrayList<Server> servers = new ArrayList<>();
        for (Map.Entry<String, ArrayList<Server>> entry : locationMap.entrySet()) {
            ArrayList<Server> serverList = entry.getValue();
            servers.addAll(serverList);
        }
        return servers;
    }

    public ArrayList<ServerLocIpInfo>  getServersInRange(double lat, double lon, double range) {
        //String serversInRangeJson = null;
        ArrayList<ServerLocIpInfo> serversInRange = new ArrayList<ServerLocIpInfo>();
        try {

            // Get all servers
            ArrayList<Server> servers = getAllServers();
            // Find servers in the range
            Iterator<Server> iter = servers.iterator();
            while (iter.hasNext()) {
                Server server = iter.next();
                double serverLat = server.getLatitude();
                double serverLon = server.getLongitude();
                double dist = distance(lat, lon, serverLat, serverLon);
                if (dist < range) {
                    server.setDistance(dist);

                    ServerLocIpInfoBuilder serverLocIpInfoBuilder = new ServerLocIpInfoBuilder();
                    serverLocIpInfoBuilder.setIpAddress(server.getIpAddress());
                    serverLocIpInfoBuilder.setLatitude(server.getLatitudeBD());
                    serverLocIpInfoBuilder.setLongitude(server.getLongitudeBD());
                    serverLocIpInfoBuilder.setLocationId(server.getLocationId());
                    serverLocIpInfoBuilder.setDistance(server.getDistanceBD());

                    ServerLocIpInfo serverLocIpInfo = serverLocIpInfoBuilder.build();

                    serversInRange.add(serverLocIpInfo);
                }
            }

            //ObjectMapper mapper = new ObjectMapper();
            //serversInRangeJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(serversInRange);

            //return serversInRangeJson;
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return serversInRange;
    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double theta = lon1 - lon2;
        double distance = Math.sin(degreeToRadian(lat1)) * Math.sin(degreeToRadian(lat2))
                + Math.cos(degreeToRadian(lat1)) * Math.cos(degreeToRadian(lat2)) * Math.cos(degreeToRadian(theta));
        distance = Math.acos(distance);
        distance = radianToDegree(distance);
        distance = distance * 60 * 1.1515;

        return distance;
    }

    private double degreeToRadian(double degree) {
        return (degree * Math.PI / 180.0);
    }

    private double radianToDegree(double radian) {
        return (radian * 180.0 / Math.PI);
    }

    private void addServerToLocationMap(Server server) {
        String locationId = server.getLocationId();
        ArrayList<Server> servers = locationMap.get(locationId);
        if (servers == null) {
            servers = new ArrayList<>();
        }

        servers.add(server);
        locationMap.put(locationId, servers);
    }

    //###################
    private CloudantClient getCloudantClient()
    {
        CloudantClient client = ClientBuilder.account(ACCOUNT)
                .username(USERNAME)
                .password(PASSWORD)
                .build();

        return client;
    }

    private void populateLocationMapFromDB() {

        try  {

            //Get Coudant client
            CloudantClient client = getCloudantClient();
            Database db = client.database(DB_NAME, true);

            // Get all servers from Cloudant DB
            List<Server> servers = null;
            try {
                servers = db.getAllDocsRequestBuilder().includeDocs(true).build().getResponse().getDocsAs(Server.class);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
         // Get all servers
           // ArrayList<Server> servers = getAllServers();
            // Find servers in the range
            Iterator<Server> iter = servers.iterator();
            while (iter.hasNext()) {
                Server server = iter.next();
                addServerToLocationMap(server);
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void populateLocationMapFromDataFile() {

        try (Scanner reader = new Scanner(new FileInputStream(dataFileLocation))) {
            // Scanner reader = new Scanner(new
            // FileInputStream("latLongfile.txt"));
            while (reader.hasNext()) {
                String data = reader.nextLine();
                String[] latLong = data.split(" ");
                double latitude = Double.parseDouble(latLong[0]);
                double longitude = Double.parseDouble(latLong[1]);
                String ipAddress = latLong[2];
                String locationId = latLong[3];

                Server server = new Server(latitude, longitude, ipAddress, locationId);
                addServerToLocationMap(server);
            }

        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    /*
    public static void main(String[] args) {
        LocationService latLongTst = LocationService.getInstance();
        String serversInRange = latLongTst.getServersInRange(31.5611, -95.81311, 30);
        System.out.println(serversInRange);

    }
    */


}

